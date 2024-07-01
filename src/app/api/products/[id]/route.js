import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/s3Client';
import extractionS3ImageKey from '@/utils/extractionS3ImageKey';
import { cookies } from 'next/headers';
import getUserSession from '@/lib/getUserSession';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    const productWithUser = await db
      .collection('products')
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: 'users', // 조인할 컬렉션 이름
            localField: 'userId', // products 컬렉션의 필드
            foreignField: '_id', // users 컬렉션의 필드
            as: 'user', // 조인 결과를 저장할 필드 이름
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true, // 사용자 정보가 없을 경우에도 결과를 반환하도록 설정
          },
        },
      ])
      .toArray();

    if (productWithUser[0]) return NextResponse.json(productWithUser[0], { status: '200' });
    else return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch product', error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const session = await getUserSession();
    const THROTTLE_TIME = 180 * 60 * 1000; // 3시간
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const cookieStore = cookies();
    let shouldIncrementView = true;

    if (session) {
      const lastView = await db.collection('viewHistory').findOne({
        userId: new ObjectId(session.user.id),
        productId: new ObjectId(id),
      });
      if (lastView && new Date() - new Date(lastView.lastViewed) < THROTTLE_TIME) {
        shouldIncrementView = false;
      } else {
        const viewHistory = await db.collection('viewHistory');
        await viewHistory.updateOne(
          { userId: new ObjectId(session.user.id), productId: new ObjectId(id) },
          { $set: { lastViewed: new Date() } },
          { upsert: true },
        );
      }
    } else {
      const lastViewed = cookieStore.get(`product_${id}`);
      if (lastViewed && new Date() - new Date(lastViewed.value) < THROTTLE_TIME) {
        shouldIncrementView = false;
      } else {
        cookieStore.set({
          name: `product_${id}`,
          value: new Date().toISOString(),
          path: '/',
          maxAge: THROTTLE_TIME / 1000,
        });
      }
    }
    if (shouldIncrementView) {
      const result = await db.collection('products').findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $inc: { views: 1 } },
        { returnDocument: 'after' }, // MongoDB v4.2+에서는 returnDocument 대신 returnNewDocument 사용
      );
      return NextResponse.json(result.value, { status: 200 });
    } else {
      const updatedProduct = await db.collection('products').findOne({ _id: new ObjectId(id) });
      return NextResponse.json(updatedProduct, { status: 200 });
    }
  } catch (error) {
    console.error('Error updating product view count:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const target = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!target) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const deletePromises = target.images.map(file => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: extractionS3ImageKey(file),
      };
      return s3Client.send(new DeleteObjectCommand(params));
    });
    await Promise.all(deletePromises);
    await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    await db.collection('users').updateOne({ _id: target.userId }, { $pull: { products: new ObjectId(id) } });
    db.collection('users').updateMany({ bookmarked: new ObjectId(id) }, { $pull: { bookmarked: new ObjectId(id) } });
    db.collection('viewHistory').deleteMany({ productId: new ObjectId(id) });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
