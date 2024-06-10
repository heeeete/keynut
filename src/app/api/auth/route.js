import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function POST(req) {
  const { authCode } = await req.json();

  const REST_API_KEY = process.env.KAKAO_REST_API_KEY;
  const REDIRECT_URI = process.env.KAKAO_REDIRECT_URI;

  const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${authCode}`;

  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    const tokenData = await tokenResponse.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ message: 'Kakao login failed', error: tokenData }, { status: 401 });
    }

    const userInfoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });
    const userInfo = await userInfoResponse.json();

    console.log(userInfo);

    // Here you can add code to store user info in your database
    const client = await connectDB;
    const db = client.db('keynut');
    const user = await db.collection('users').findOne({ provider: 'kakao', providerId: userInfo.id });

    if (user) {
      // 사용자가 이미 존재하는 경우 updatedAt만 업데이트
      const updatedUser = await db.collection('users').findOneAndUpdate(
        { provider: 'kakao', providerId: userInfo.id },
        {
          $set: {
            updatedAt: new Date(),
          },
        },
        { returnDocument: 'after' },
      );
    } else {
      // 사용자가 존재하지 않는 경우 새로운 사용자 삽입
      const newUser = await db.collection('users').insertOne({
        provider: 'kakao',
        providerId: userInfo.id,
        nickname: userInfo.properties.nickname,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ message: 'Login successful', user: userInfo });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
