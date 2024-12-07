import connectDB from '@keynut/lib/mongodb';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';

interface Params {
  params: {
    userId: string;
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    // const session = await getUserSession();
    // if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const users = db.collection('users');
    const { userId } = params;
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
