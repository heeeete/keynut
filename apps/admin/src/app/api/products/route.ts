import { NextResponse } from 'next/server';
import { connectDB } from '@keynut/lib/server';
import { ObjectId } from 'mongodb';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from '@keynut/lib/server';
import { revalidateTag } from 'next/cache';
import { ProductData } from '@keynut/type';

interface SearchQuery {
  userId?: string;
  $or?: Array<
    | { title?: { $regex: string; $options: string } }
    | { tags?: { $elemMatch: { $regex: string; $options: string } } }
  >;
  $and?: Array<{ price?: { $gte?: number; $lte?: number } }>;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL);
    const offset = parseInt(searchParams.get('offset')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const nickname = searchParams.get('nickname');
    const keyword = searchParams.get('keyword');
    const price = searchParams.get('price');

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    let searchQuery: SearchQuery = {};

    if (nickname) {
      const user = await db.collection('users').findOne({
        nickname: { $regex: nickname, $options: 'i' },
      });
      if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
      }

      if (keyword) {
        searchQuery = {
          userId: user._id,
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { tags: { $elemMatch: { $regex: keyword, $options: 'i' } } },
          ],
        };
      } else {
        searchQuery.userId = user._id;
      }
    } else if (keyword) {
      searchQuery = {
        $or: [
          { title: { $regex: keyword, $options: 'i' } },
          { tags: { $elemMatch: { $regex: keyword, $options: 'i' } } },
        ],
      };
    }

    if (price) {
      const priceConditions = price
        .split(' ')
        .map((condition) => {
          const operator = condition[0];
          const value = parseInt(condition.substring(1), 10);
          if (operator === '>') {
            return { price: { $gte: value } };
          } else if (operator === '<') {
            return { price: { $lte: value } };
          } else {
            return null;
          }
        })
        .filter(Boolean);

      if (priceConditions.length > 0) {
        searchQuery.$and = (searchQuery.$and || []).concat(priceConditions);
      }
    }

    const pipeline = [
      { $match: searchQuery },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $addFields: {
          nickname: { $arrayElemAt: ['$userInfo.nickname', 0] },
        },
      },
      {
        $project: {
          userInfo: 0,
        },
      },
    ];

    const products = await db.collection('products').aggregate(pipeline).toArray();
    const total = await db.collection('products').countDocuments(searchQuery);

    return NextResponse.json(
      { products, total },
      {
        status: 200,
      },
    );
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const formData = await req.formData();
    const ids = JSON.parse(formData.get('products') as string);

    const deleteProduct = async (id: number) => {
      const target: ProductData = await db
        .collection('products')
        .findOne({ _id: new ObjectId(id) });
      if (!target) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }

      const deletePromises = target.images.map((file) => {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: file.name,
        };
        return s3Client.send(new DeleteObjectCommand(params));
      });
      await Promise.all(deletePromises);

      await db.collection('products').deleteOne({ _id: new ObjectId(id) });
      await db
        .collection('users')
        .updateOne({ _id: target.userId }, { $pull: { products: new ObjectId(id) } });
      await db
        .collection('users')
        .updateMany({ bookmarked: new ObjectId(id) }, { $pull: { bookmarked: new ObjectId(id) } });
      await db.collection('viewHistory').deleteMany({ productId: new ObjectId(id) });
    };

    await Promise.all(ids.map(deleteProduct));

    revalidateTag('products');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
