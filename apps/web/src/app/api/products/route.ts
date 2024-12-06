import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { connectDB } from '@keynut/lib';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import checkBannedEmail from '@/lib/checkBannedEmail';
import { User } from '@keynut/type';
import { GET } from '@keynut/api/products';
import { s3Client } from '@keynut/lib';

export { GET };

export async function POST(req: Request) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    if (await checkBannedEmail(session.user.email, db))
      return NextResponse.json({ error: 'Your account has been banned.' }, { status: 403 });
    const products = db.collection('products');
    const users = db.collection('users');

    const formData = await req.formData();

    const product = {
      userId: new ObjectId(session.user.id), // 사용자 ID 추가
      title: formData.get('title'),
      category: Number(formData.get('subCategory')),
      condition: Number(formData.get('condition')),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      images: JSON.parse(formData.get('imageDetails').toString()),
      bookmarked: [],
      complain: [],
      openChatUrl: formData.get('openChatUrl'),
      tags: JSON.parse(formData.get('tags').toString()),
      views: 0,
      state: 1,
      createdAt: new Date(),
    };

    const result = await products.insertOne(product);
    await users.updateOne(
      { email: session.user.email },
      {
        $set: { openChatUrl: formData.get('openChatUrl') },
        $addToSet: {
          products: result.insertedId,
        },
      },
    );
    revalidateTag('products');
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

interface CustomSession {
  user: User;
}

// 상품 수정 API
export async function PUT(req: Request) {
  try {
    const session: CustomSession = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    if (await checkBannedEmail(session.user.email, db))
      return NextResponse.json({ error: 'Your account has been banned.' }, { status: 403 });
    const products = db.collection('products');
    const users = db.collection('users');

    const formData = await req.formData();
    const deleteFiles = formData.getAll('deleteFiles');

    await Promise.all(
      deleteFiles.map((file) => {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: file as string,
        };
        return s3Client.send(new DeleteObjectCommand(params));
      }),
    );

    await users.updateOne(
      { email: session.user.email },
      { $set: { openChatUrl: formData.get('openChatUrl') } },
    );
    let tags: string[] | [] = JSON.parse(formData.get('tags').toString());

    await products.updateOne(
      { _id: new ObjectId(formData.get('id').toString()) },
      {
        $set: {
          title: formData.get('title'),
          category: Number(formData.get('subCategory')),
          condition: Number(formData.get('condition')),
          description: formData.get('description'),
          price: Number(formData.get('price')),
          images: JSON.parse(formData.get('imageDetails').toString()),
          openChatUrl: formData.get('openChatUrl'),
          tags: JSON.parse(formData.get('tags').toString()),

          updatedAt: new Date(),
        },
      },
    );
    const productId = formData.get('id') as string;
    revalidateTag(productId);
    revalidateTag('products');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
