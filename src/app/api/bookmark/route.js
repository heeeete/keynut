import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/app/utils/getUserSession';
import { ObjectId } from 'mongodb';

const client = await connectDB;
const db = client.db(process.env.MONGODB_NAME);
const collection = db.collection('products');
const users = db.collection('users');

export async function GET(req) {
  try {
    const ids = await req.json();
    const objectIds = ids.map(id => new ObjectId(id));
    const products = await collection.find({ _id: { $in: objectIds } }).toArray();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Failed to retrieve bookmarked products:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {}
