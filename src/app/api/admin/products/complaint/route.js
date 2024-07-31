import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const session = await getUserSession();
    if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(req.url, process.env.NEXTAUTH_URL);
    const offset = parseInt(searchParams.get('offset')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const productsCollection = await db.collection('products');

    // complain 배열의 길이가 1 이상인 상품을 필터링하는 쿼리
    const pipeline = [
      { $match: { complain: { $exists: true, $ne: [] } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'userId',
          foreignField: 'userId',
          as: 'userAccount',
        },
      },
      {
        $addFields: {
          userInfo: { $arrayElemAt: ['$userInfo', 0] },
        },
      },
      {
        $addFields: {
          userAccount: { $arrayElemAt: ['$userAccount', 0] },
        },
      },
      { $skip: offset },
      { $limit: limit },
    ];

    const products = await productsCollection.aggregate(pipeline).toArray();

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
