import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';

export async function POST(req) {
  try {
    const { email, state } = await req.json();

    if (!email || (state !== 0 && state !== 1))
      return NextResponse.json({ error: 'Invalid email or state' }, { status: 400 });

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    if (state === 0) {
      // 이미 정지된 이메일인지 확인
      const existingBan = await db.collection('bannedEmails').findOne({ email });
      if (existingBan) return NextResponse.json({ error: 'Email is already banned' }, { status: 400 });
      await db.collection('bannedEmails').insertOne({ email });
      return NextResponse.json({ message: 'User banned successfully' }, { status: 200 });
    } else if (state === 1) {
      const deleteResult = await db.collection('bannedEmails').deleteOne({ email });
      return NextResponse.json({ message: 'User unbanned successfully' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Invalid state' }, { status: 400 });
  } catch (error) {
    console.error('Error updating ban state:', error);
    return NextResponse.json({ error: 'Failed to update ban state' }, { status: 500 });
  }
}
