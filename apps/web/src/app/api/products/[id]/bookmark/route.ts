import getUserSession from '@/lib/getUserSession';
import connectDB from '@keynut/lib/mongodb';
import User from '@keynut/type/user';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

interface Session {
  user: User;
}

export async function POST(req: Request, { params }: Params) {
  try {
    const { id } = params;
    const session: Session = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });
    const { isBookmarked } = await req.json();

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    await db
      .collection('products')
      .updateOne(
        { _id: new ObjectId(id) },
        isBookmarked
          ? { $pull: { bookmarked: new ObjectId(session.user.id) } }
          : { $addToSet: { bookmarked: new ObjectId(session.user.id) } },
      );
    await db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(session.user.id) },
        isBookmarked
          ? { $pull: { bookmarked: new ObjectId(id) } }
          : { $addToSet: { bookmarked: new ObjectId(id) } },
      );
    revalidateTag(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: `상품 조회 error : ${error}` }, { status: 500 });
  }
}
