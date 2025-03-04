import connectDB from '@keynut/lib/mongodb';
import userBanHandler from '@keynut/lib/userBanHandler';
import User from '@keynut/type/user';
import { NextResponse } from 'next/server';

interface RequestBody {
  providerAccountId: string;
  _id: string;
}

export async function POST(req: Request) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const { providerAccountId, _id }: RequestBody = await req.json();

    const body = new URLSearchParams({
      target_id_type: 'user_id',
      target_id: providerAccountId,
    });

    const res = await fetch('https://kapi.kakao.com/v1/user/unlink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(errorData);
      return NextResponse.json({ error: errorData }, { status: res.status });
    }

    const user = await db.collection<User>('users').findOne({ _id: _id });
    if (!user) {
      return NextResponse.json({ message: '유저를 찾을 수 없습니다.' }, { status: 404 });
    }
    const { email } = user;
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    const expiresAt = Math.floor(date.getTime() / 1000);

    const status = await userBanHandler(email, 0, expiresAt);
    if (status !== 200) return NextResponse.json({}, { status });

    const res2 = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${_id}`, {
      method: 'DELETE',
    });
    if (!res2.ok) {
      const error = await res2.json();
      return NextResponse.json({ error: error }, { status: res2.status });
    }
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
