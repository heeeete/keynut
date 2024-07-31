import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    // const session = await getUserSession();
    // if (!session.admin) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
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
        $lookup: {
          from: 'bannedEmails',
          localField: 'email',
          foreignField: 'email',
          as: 'banInfo',
        },
      },
      {
        $addFields: {
          provider: { $arrayElemAt: ['$accountInfo.provider', 0] },
          access_token: { $arrayElemAt: ['$accountInfo.access_token', 0] },
          providerAccountId: { $arrayElemAt: ['$accountInfo.providerAccountId', 0] },
          state: {
            $cond: {
              if: { $gt: [{ $size: '$banInfo' }, 0] },
              then: 0,
              else: 1,
            },
          },
        },
      },
      {
        $project: {
          accountInfo: 0,
          banInfo: 0,
        },
      },
    ];

    const users = await db.collection('users').aggregate(pipeline).toArray();
    const total = await db.collection('users').countDocuments(searchQuery);

    return NextResponse.json({ users, total }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const usersCollection = await db.collection('users');
    const body = await req.json();

    const updateFields = {};
    for (const key in body) {
      if (key !== 'id') {
        updateFields[key] = body[key];
      }
    }

    await usersCollection.updateOne({ _id: new ObjectId(body.id) }, { $set: updateFields });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
