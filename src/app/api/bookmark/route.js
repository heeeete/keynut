import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';

const client = await connectDB;
const db = client.db(process.env.MONGODB_NAME);
const collection = db.collection('products');
const users = db.collection('users');

export async function GET(req) {
  try {
    const session = await getUserSession();
    const { bookmarked } = await users.findOne({ _id: new ObjectId(session.user.id) });
    console.log('--------------', bookmarked.length);
    if (!bookmarked || bookmarked.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    const bookmarkedProducts = await collection
      .find({ _id: { $in: bookmarked.map(id => new ObjectId(id)) } })
      .toArray();
    return NextResponse.json(bookmarkedProducts, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve bookmarked products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {}