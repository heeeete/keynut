import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const session = await getServerSession(authOptions);
    const { isBookmarked } = await req.json();

    console.log('=====================================', req);
    const queryParam = req.nextUrl.searchParams.get('a'); // 'a'에 해당하는 쿼리 파라미터 값 가져오기
    console.log(queryParam);
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    await db
      .collection('products')
      .updateOne(
        { _id: new ObjectId(id) },
        isBookmarked ? { $pull: { bookmarked: session.user.id } } : { $addToSet: { bookmarked: session.user.id } },
      );
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `상품 조회 error : ${error}` }, { status: 500 });
  }
}
