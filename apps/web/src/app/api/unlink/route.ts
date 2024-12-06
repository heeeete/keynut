import userBanHandler from '@/app/(admin)/admin/_lib/userBanHandler';
import getUserSession from '@/lib/getUserSession';
import { connectDB } from '@keynut/lib';
import refreshAccessToken from '@/lib/refreshAccessToken';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

async function kakaoUnlink(access_token: string) {
  const res = await fetch('https://kapi.kakao.com/v1/user/unlink', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${access_token}`,
    },
  });
  if (!res.ok) {
    const error = await res.json();
    console.error('Kakao unlink error:', error);
    throw new Error('Failed to unlink Kakao user');
  }
}

async function naverUnlink(access_token: string) {
  const res = await fetch(
    `https://nid.naver.com/oauth2.0/token?grant_type=delete&client_id=${process.env.NAVER_CLIENT_ID}&client_secret=${process.env.NAVER_CLIENT_SECRET}&access_token=${access_token}`,
    {
      method: 'POST',
    },
  );
  if (res.status === 401) {
  }

  const data = await res.json();

  if (data.result !== 'success') {
    console.error('Naver unlink error:', data);
    throw new Error(data);
  }
}

interface Req {
  userId: string;
  expires_at: number;
}

interface Account {
  provider: string;
  access_token: string;
  refresh_token: string;
  expires_at: number; // Unix 타임스탬프 (초 또는 밀리초)
}

export async function POST(req: Request) {
  try {
    const { userId, expires_at: time }: Req = await req.json();

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    let { provider, access_token, refresh_token, expires_at }: Account = await db
      .collection('accounts')
      .findOne({ userId: new ObjectId(userId) });
    const { email } = await db.collection('users').findOne({ _id: new ObjectId(userId) });

    if (new Date(expires_at * 1000) <= new Date()) {
      const tokenData = await refreshAccessToken(provider, refresh_token);
      if (tokenData.error) throw new Error(tokenData.error);
      access_token = tokenData.access_token;
      console.log('리프레쉬 토큰 재발급 성공');
    }
    if (provider === 'kakao') await kakaoUnlink(access_token);
    else if (provider === 'naver') await naverUnlink(access_token);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${userId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    const res2 = await userBanHandler(email, 0, time);
    if (res2 !== 200) return NextResponse.json({}, { status: res2 });

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
