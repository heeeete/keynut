import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  try {
    const { id } = params;

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    const productWithUser = await db
      .collection('products')
      .aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: 'users', // 조인할 컬렉션 이름
            localField: 'userId', // products 컬렉션의 필드
            foreignField: '_id', // users 컬렉션의 필드
            as: 'user', // 조인 결과를 저장할 필드 이름
          },
        },
        {
          $unwind: {
            path: '$user',
            preserveNullAndEmptyArrays: true, // 사용자 정보가 없을 경우에도 결과를 반환하도록 설정
          },
        },
      ])
      .toArray();

    if (productWithUser[0]) return NextResponse.json(productWithUser[0], { status: '200' });
    else return NextResponse.json({ message: 'Product not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to fetch product', error: error.message }, { status: 500 });
  }
}
