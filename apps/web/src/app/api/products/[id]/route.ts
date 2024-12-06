import connectDB from '@keynut/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import getUserSession from '@/lib/getUserSession';
import { DELETE } from '@keynut/api/products/id';

interface Params {
  id: string;
}

export async function GET(req, { params }) {
  try {
    const { id }: Params = params;
    console.log(id);

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
        {
          $lookup: {
            from: 'accounts', // 조인할 컬렉션 이름 (accounts)
            localField: 'user._id', // users 컬렉션의 _id 필드를 사용하여 조인
            foreignField: 'userId', // accounts 컬렉션의 userId 필드
            as: 'account', // 조인 결과를 저장할 필드 이름
          },
        },
        {
          $unwind: {
            path: '$account',
            preserveNullAndEmptyArrays: true, // 계정 정보가 없을 경우에도 결과를 반환하도록 설정
          },
        },
        {
          $addFields: {
            'user.provider': '$account.provider', // account에서 가져온 provider 정보를 user 필드에 추가
          },
        },
        {
          $project: {
            account: 0, // account 필드를 결과에서 제거 (원하지 않는 경우)
          },
        },
      ])
      .toArray();

    if (productWithUser[0]) return NextResponse.json(productWithUser[0], { status: 200 });
    else return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: 'Failed to fetch product', error: error.message },
      { status: 500 },
    );
  }
}

interface ViewHistory {
  _id: string;
  productId: string;
  userId: string;
  lastViewed: string;
}

export async function PUT(req, { params }) {
  try {
    const { id }: Params = params;
    const session = await getUserSession();
    const THROTTLE_TIME = 180 * 60 * 1000; // 3시간
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const cookieStore = cookies();
    let shouldIncrementView = true;

    if (session) {
      const lastView: ViewHistory = await db.collection('viewHistory').findOne({
        userId: new ObjectId(session.user.id),
        productId: new ObjectId(id),
      });
      if (
        lastView &&
        new Date().getTime() - new Date(lastView.lastViewed).getTime() < THROTTLE_TIME
      ) {
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
      if (
        lastViewed &&
        new Date().getTime() - new Date(lastViewed.value).getTime() < THROTTLE_TIME
      ) {
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

export { DELETE };
