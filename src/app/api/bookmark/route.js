import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const collection = db.collection('products');
    const users = db.collection('users');
    const session = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });
    const { bookmarked } = await users.findOne({ _id: new ObjectId(session.user.id) });
    if (!bookmarked || bookmarked.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    const bookmarkedProducts = await collection.find({ _id: { $in: bookmarked } }).toArray();
    const map = new Map();
    bookmarkedProducts.map(a => {
      map.set(a._id.toString(), a);
    });
    const sortedProducts = bookmarked.reverse().map(a => {
      return map.get(a.toString());
    });
    return NextResponse.json(sortedProducts, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve bookmarked products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {}
