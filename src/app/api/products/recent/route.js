import { connectDB } from '@/lib/mongodb';
import { create } from 'domain';
import { NextResponse } from 'next/server';

const client = await connectDB;
const db = client.db(process.env.MONGODB_NAME);
const products = db.collection('products');

export async function GET() {
  try {
    const recentProducts = await products.find({}).sort({ createdAt: -1 }).limit(5).toArray();
    return NextResponse.json(recentProducts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}