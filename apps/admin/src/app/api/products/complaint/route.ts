import { NextResponse } from 'next/server';
import { connectDB } from '@keynut/lib/server';
import getUserSession from '@/lib/getUserSession';
import { ProductData } from '@keynut/type';
import { KakaoAccounts, NaverAccounts } from '@keynut/type';
import { User } from '@keynut/type';

export const dynamic = 'force-dynamic'; // 동적 생성 모드 설정

interface Data extends ProductData {
  userAccount: NaverAccounts | KakaoAccounts;
  userInfo: Partial<User>;
}

export async function GET(req: Request) {
  try {
    const session = await getUserSession();
    if (!session) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL);
    const offset = parseInt(searchParams.get('offset')) || 0;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const productsCollection = await db.collection('products');

    // complain 배열의 길이가 1 이상인 상품을 필터링하는 쿼리
    const pipeline = [
      { $match: { complain: { $exists: true, $ne: [] } } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'userId',
          foreignField: 'userId',
          as: 'userAccount',
        },
      },
      {
        $addFields: {
          userInfo: { $arrayElemAt: ['$userInfo', 0] },
        },
      },
      {
        $addFields: {
          userAccount: { $arrayElemAt: ['$userAccount', 0] },
        },
      },
      { $skip: offset },
      { $limit: limit },
    ];

    const products: Data[] | [] = await productsCollection.aggregate(pipeline).toArray();
    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
