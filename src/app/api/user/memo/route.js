import getUserSession from '@/lib/getUserSession';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    const session = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const users = db.collection('users');
    const { memo } = await req.json();
    const { userId, tempMemo } = memo;
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let updateQuery;
    if (tempMemo === '') {
      updateQuery = { $unset: { [`memo.${session.user.id}`]: '' } };
    } else {
      updateQuery = { $set: { [`memo.${session.user.id}`]: tempMemo } };
    }

    // Update or remove the memo field for the user
    const result = await users.updateOne({ _id: new ObjectId(userId) }, updateQuery);
    const products = user.products;
    for (let product of products) revalidateTag(product.toString());

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
