import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOption } from '../../auth/[...nextauth]/route';
import { connectDB } from '@/lib/mongodb';

export async function GET(req) {
  try {
    // 세션을 확인합니다.
    console.log(req);
    const session = await getServerSession(authOption);

    console.log('SESSION = ', session);

    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // MongoDB에 연결합니다.
    const client = await connectDB;
    const db = client.db('keynut');

    // 예시 응답
    return NextResponse.json({ message: 'HELLO' });
  } catch (error) {
    console.error('Internal Server Error:', error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}
