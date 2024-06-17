import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    const { id } = params;

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
    console.log('ㄴㄸㄲㅍㄸㄲ======================', product);
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: `상품 조회 error : ${error}` }, { status: 500 });
  }
}
