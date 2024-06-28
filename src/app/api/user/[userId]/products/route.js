import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

const client = await connectDB;
const db = client.db(process.env.MONGODB_NAME);
const users = db.collection('users');
const products = db.collection('products');

export async function GET(req, { params }) {
  const { userId } = params;
  try {
    if (!ObjectId.isValid(userId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    if (!user.products) {
      return NextResponse.json([], { status: 200 });
    }
    const userProducts = await products
      .find({
        _id: { $in: user.products },
      })
      .toArray();
    return NextResponse.json(userProducts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
