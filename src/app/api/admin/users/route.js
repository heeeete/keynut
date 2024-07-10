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
    const keyword = searchParams.get('keyword');

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    const searchQuery = keyword
      ? { $or: [{ nickname: { $regex: keyword, $options: 'i' } }, { email: { $regex: keyword, $options: 'i' } }] }
      : {};

    const pipeline = [
      { $match: searchQuery },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: 'accounts',
          localField: '_id',
          foreignField: 'userId',
          as: 'accountInfo',
        },
      },
      {
        $addFields: {
          provider: { $arrayElemAt: ['$accountInfo.provider', 0] },
          access_token: { $arrayElemAt: ['$accountInfo.access_token', 0] },
          providerAccountId: { $arrayElemAt: ['$accountInfo.providerAccountId', 0] },
        },
      },
      {
        $project: {
          accountInfo: 0,
        },
      },
    ];

    const users = await db.collection('users').aggregate(pipeline).toArray();
    const total = await db.collection('users').countDocuments(searchQuery);

    return NextResponse.json({ users, total }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
