import getUserSession from '@/lib/getUserSession';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(req, { params }) {
  try {
    const { id } = params;
    const { user: session } = await getUserSession();
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
        isBookmarked ? { $pull: { bookmarked: new ObjectId(id) } } : { $addToSet: { bookmarked: new ObjectId(id) } },
      );
    revalidateTag(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: `상품 조회 error : ${error}` }, { status: 500 });
  }
}
