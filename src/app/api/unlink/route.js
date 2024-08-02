import getUserSession from '@/lib/getUserSession';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

async function kakaoUnlink(access_token) {
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

async function googleUnlink(access_token) {
  const res = await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${access_token}`, {
    method: 'POST',
  });
  if (!res.ok) {
    const error = await res.json();
    console.error('Google unlink error:', error);
    throw new Error('Failed to unlink Google user');
  }
}

export async function POST() {
  try {
    const session = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const { provider, access_token } = await db
      .collection('accounts')
      .findOne({ userId: new ObjectId(session.user.id) });

    if (provider === 'kakao') await kakaoUnlink(access_token);
    else if (provider === 'google') await googleUnlink(access_token);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/${session.user.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const error = await res.json();
      return NextResponse.json(error, { status: res.status });
    }

    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({}, { status: 500 });
  }
}
