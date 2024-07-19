import getUserSession from '@/lib/getUserSession';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { user: session } = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const { lastRaiseReset, raiseCount } = await db.collection('users').findOne({ _id: new ObjectId(session.id) });

    const now = new Date();
    const nowDate = now.toISOString().split('T')[0];
    const lastRaiseResetDate = new Date(lastRaiseReset).toISOString().split('T')[0];

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
