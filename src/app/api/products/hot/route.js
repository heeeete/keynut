import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

const client = await connectDB;
const db = client.db(process.env.MONGODB_NAME);
const products = db.collection('products');

export async function GET(req) {
  const url = new URL(req.url);
  const category = url.searchParams.get('category');
  let query = {};
  const categories = [];

  if (category) {
    const categoryNum = parseInt(category, 10);
    if (categoryNum === 1) {
      categories.push(10, 11, 12, 13, 14, 15, 19);
    } else if (categoryNum === 2) {
      categories.push(29);
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
