import connectDB from '@keynut/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const client = await connectDB;
  const db = client.db(process.env.MONGODB_NAME);
  const products = db.collection('products');

  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  let query: Record<string, any> = { $or: [{ state: 1 }, { state: 2 }] };
  const categories = [];

  if (category) {
    const categoryNum = parseInt(category, 10);
    if (categoryNum === 1) {
      categories.push(10, 11, 12, 13, 14, 15, 16, 19);
    } else if (categoryNum === 2) {
      categories.push(20, 21, 22, 23, 29);
    } else if (categoryNum === 3) {
      categories.push(30, 31, 39);
    } else if (categoryNum === 4) {
      categories.push(4);
    } else if (categoryNum === 5) {
      categories.push(5);
    } else if (categoryNum === 9) {
      categories.push(9);
    }
    query.category = { $in: categories };
  }
  try {
    const topProducts = await products.find(query).sort({ views: -1 }).limit(6).toArray();
    return NextResponse.json(topProducts, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
