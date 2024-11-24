import getUserSession from '@/lib/getUserSession';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/type/user';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // 동적 생성 모드 설정

export async function GET() {
  try {
    const { user: session }: { user: User } = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const user: User = await db.collection('users').findOne({ _id: new ObjectId(session.id) });
    const { lastRaiseReset, raiseCount } = user;

    const now = new Date();
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const nowDate = kstNow.toISOString().split('T')[0];

    const lastRaiseResetDate = new Date(new Date(lastRaiseReset).getTime() + 9 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    if (nowDate === lastRaiseResetDate) {
      return NextResponse.json(raiseCount, { status: 200 });
    } else {
      await db.collection('users').updateOne(
        { _id: new ObjectId(session.id) },
        {
          $set: {
            raiseCount: 5,
            lastRaiseReset: new Date(),
          },
        },
      );
      return NextResponse.json(5, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
