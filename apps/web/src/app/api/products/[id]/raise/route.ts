import getUserSession from '@/lib/getUserSession';
import { connectDB } from '@keynut/lib';
import { User } from '@keynut/type';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

interface Params {
  params: {
    id: string;
  };
}

export async function PATCH(req: Request, { params }: Params) {
  try {
    const { user: session }: { user: User } = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });

    const { id } = params;
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    const updateProductPromise = db
      .collection('products')
      .updateOne({ _id: new ObjectId(id) }, { $set: { createdAt: new Date() } });

    const updateUserPromise = db
      .collection('users')
      .updateOne({ _id: new ObjectId(session.id) }, { $inc: { raiseCount: -1 } });

    await Promise.all([updateProductPromise, updateUserPromise]);
    revalidateTag('products');
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(error, { status: 500 });
  }
}
