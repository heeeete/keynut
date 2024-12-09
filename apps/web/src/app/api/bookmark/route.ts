import { NextResponse } from 'next/server';
import connectDB from '@keynut/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';
import ProductData from '@keynut/type/productData';
import User from '@keynut/type/user';

export async function GET() {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const collection = db.collection('products');
    const users = db.collection('users');
    const session = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });
    const user = await users.findOne<User>({
      _id: new ObjectId(session.user.id),
    });
    if (!user) {
      return NextResponse.json({ message: '유저를 찾을 수 없습니다.' }, { status: 404 });
    }
    const { bookmarked } = user;
    if (!bookmarked || bookmarked.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const objectIds = bookmarked.map((id) => new ObjectId(id));

    const bookmarkedProducts = await collection.find({ _id: { $in: objectIds } }).toArray();
    const map = new Map();
    bookmarkedProducts.map((a) => {
      map.set(a._id.toString(), a);
    });
    const sortedProducts: ProductData[] = bookmarked.reverse().map((a) => {
      return map.get(a.toString());
    });
    return NextResponse.json(sortedProducts, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve bookmarked products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST() {}
