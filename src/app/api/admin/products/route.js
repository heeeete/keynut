import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';

export async function GET(req) {
  try {
    const session = await getUserSession();
    if (!session.admin) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(req.url, process.env.NEXTAUTH_URL);
    const offset = parseInt(searchParams.get('offset')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const nickname = searchParams.get('nickname');
    const keyword = searchParams.get('keyword');
    const price = searchParams.get('price');

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    let searchQuery = {};

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
        .map(condition => {
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
