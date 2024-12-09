import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@keynut/lib/s3Client';
import connectDB from '@keynut/lib/mongodb';
import { revalidateTag } from 'next/cache';

interface Image {
  name: string;
  width: number;
  height: number;
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const target = await db.collection('products').findOne({ _id: new ObjectId(id) });
    if (!target) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const deletePromises = target.images.map((image: Image) => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: image.name,
      };
      return s3Client.send(new DeleteObjectCommand(params));
    });
    await Promise.all(deletePromises);
    await db.collection('products').deleteOne({ _id: new ObjectId(id) });
    await db
      .collection('users')
      .updateOne({ _id: target.userId }, { $pull: { products: new ObjectId(id) } });
    await db.collection('users').updateMany(
      { bookmarked: { $in: [new ObjectId(id)] } }, // 조건
      { $pull: { bookmarked: new ObjectId(id) } as any }, // 강제 타입 단언
    );
    db.collection('viewHistory').deleteMany({ productId: new ObjectId(id) });
    revalidateTag('products');
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
