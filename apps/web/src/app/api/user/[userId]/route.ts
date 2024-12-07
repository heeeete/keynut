import { NextResponse } from 'next/server';
import connectDB from '@keynut/lib/mongodb';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ObjectId, UpdateResult } from 'mongodb';
import { revalidateTag } from 'next/cache';
import s3Client from '@keynut/lib/s3Client';

interface Params {
  params: {
    userId: string;
  };
}

//회원탈퇴
export async function DELETE(req: Request, { params }: Params) {
  const { userId: id } = params;
  const userId = new ObjectId(id);
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const userCollection = db.collection('users');

    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { bookmarked, products } = user;

    // 사용자가 북마크한 상품의 북마크 목록에서 해당 유저 제거
    const updateBookmarkedPromises = bookmarked.map((productId: string) =>
      db
        .collection('products')
        .updateOne({ _id: new ObjectId(productId) }, { $pull: { bookmarked: userId } }),
    );
    await Promise.all(updateBookmarkedPromises);

    // 다른 사용자들이 북마크한 상품에서 해당 유저 제거, 상품 이미지, 조회 기록 제거
    for (let productId of products) {
      const product = await db.collection('products').findOne({ _id: productId });
      if (!product) {
        console.log(`Product with ID ${productId} not found.`);
        continue;
      }

      const updateProductBookmarksPromises: Promise<UpdateResult>[] = (
        product.bookmarked || []
      ).map((uId: string) =>
        userCollection.updateOne({ _id: new ObjectId(uId) }, { $pull: { bookmarked: productId } }),
      );
      await Promise.all(updateProductBookmarksPromises);

      const deleteS3ImagesPromises: Promise<void>[] = product.images.map(async (img: string) => {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: img,
        };
        try {
          await s3Client.send(new DeleteObjectCommand(params));
        } catch (err) {
          console.error('Failed to delete S3 image:', err);
        }
      });
      await Promise.all(deleteS3ImagesPromises);

      try {
        await db.collection('viewHistory').deleteMany({ productId: productId });
      } catch (err) {
        console.error('Failed to delete view history:', err);
      }
    }

    const deleteUserPromises = [
      userCollection.deleteOne({ _id: userId }),
      db.collection('accounts').deleteMany({ userId: userId }),
      db.collection('products').deleteMany({ userId: userId }),
      db.collection('viewHistory').deleteMany({ userId: userId }),
    ];

    await Promise.all(deleteUserPromises);
    revalidateTag('products');
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
