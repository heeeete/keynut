import { connectDB } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  const { userId } = params;
  // console.log('userId', userId);
  if (!ObjectId.isValid(userId)) {
    return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
  }

  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const users = db.collection('users');
    const products = db.collection('products');
    const accounts = db.collection('accounts');

    // 병렬로 사용자 정보와 사용자 제품 데이터를 가져옴
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { provider } = await accounts.findOne({ userId: new ObjectId(userId) });

    // console.log('------provider-----', provider);
    // 사용자 제품 정보를 가져옴
    const userProducts = await products
      .find({ _id: { $in: user.products || [] } }) // products 배열이 비어 있을 경우를 대비
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ userProfile: user, userProducts, provider }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
