import { connectDB } from '@keynut/lib/server';
import { ProductData } from '@keynut/type';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const products = db.collection('products');
    const recentProducts: ProductData[] = await products
      .find({ $or: [{ state: 1 }, { state: 2 }] })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    return NextResponse.json(recentProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
