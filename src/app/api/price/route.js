import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(req) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    const { searchParams } = new URL(req.url, `${process.env.NEXT_PUBLIC_BASE_URL}`);
    const keywordParam = searchParams.get('keyword');
    const lastProductId = searchParams.get('lastId');
    const calculate = searchParams.get('calculate') === 'true';

    let query = { state: 1 };
    if (keywordParam) {
      if (keywordParam[0] === '#') {
        const hashTag = keywordParam.split(' ')[0];
        query.tags = { $elemMatch: { $eq: hashTag } };
      } else {
        query.title = { $regex: keywordParam, $options: 'i' };
      }
    }

    if (lastProductId) {
      query._id = { $lt: new ObjectId(lastProductId) };
    }

    let price = null;
    if (calculate) {
      const totalProducts = await db.collection('products').find(query).toArray();
      if (totalProducts.length > 0) {
        price = totalProducts.reduce((sum, product) => sum + product.price, 0) / totalProducts.length;
      } else {
        price = 0;
      }
    }

    const products = await db.collection('products').find(query).sort({ createdAt: -1 }).limit(42).toArray();

    return NextResponse.json({ products, price }, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
