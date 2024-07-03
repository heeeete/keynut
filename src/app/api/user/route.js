import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import s3Client from '@/lib/s3Client';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ObjectId } from 'mongodb';
import extractionS3ImageKey from '@/utils/extractionS3ImageKey';

const forbiddenList = [
  '씨발',
  '시발',
  '니미',
  '미친',
  '장애인',
  '병신',
  '븅신',
  '쉬발',
  '애미',
  '좆',
  '썅년',
  '자지',
  '보지',
  '섹스',
  '개새끼',
];

export async function GET(req) {
  try {
    const session = await getUserSession();
    if (!session.admin) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

    const { searchParams } = new URL(req.url, process.env.NEXTAUTH_URL);
    const offset = searchParams.get('offset');
    const limit = searchParams.get('limit');
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    const users = await db.collection('users').find().skip(parseInt(offset)).limit(parseInt(limit)).toArray();

    const total = await db.collection('users').countDocuments();

    return NextResponse.json({ users, total }, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}


export async function PUT(req) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const users = db.collection('users');
    const { user: session } = await getUserSession();
    let uploadedUrl = null;
    const formData = await req.formData();
    const oldImage = JSON.parse(formData.get('oldImage'));
    const newImage = formData.get('newImage');
    const nickname = JSON.parse(formData.get('nickname'));

    const deleteImage = async () => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: extractionS3ImageKey(oldImage),
      };
      await s3Client.send(new DeleteObjectCommand(params));
    };

    const uploadImage = async () => {
      const arrayBuffer = await newImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: `profile_${Date.now()}_${newImage.name}`,
        Body: buffer,
        ContentType: newImage.type,
      };
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      const url = `${process.env.AWS_S3_BASE_URL}/${uploadParams.Key}`;
      uploadedUrl = url;
    };

    if (oldImage || newImage) {
      if (oldImage) await deleteImage();
      if (newImage) await uploadImage();
      const res = await users.updateOne(
        { _id: new ObjectId(session.id) },
        {
          $set: {
            image: uploadedUrl,
          },
        },
      );
      const resUrl = { url: uploadedUrl };
      return NextResponse.json(resUrl, { status: 200 });
    }
    if (nickname) {
      const now = new Date();
      const lastChanged = session.nicknameChangedAt ? new Date(session.nicknameChangedAt) : null;
      if (lastChanged) {
        const period = Math.floor((now - lastChanged) / (1000 * 60 * 60 * 24));
        if (period < 30) return NextResponse.json({ state: 0 }, { status: 403 });
      }
      const exisitingUser = await users.findOne({ nickname: nickname });
      if (exisitingUser) {
        return NextResponse.json('dup', { status: 409 });
      }
      if (forbiddenList.some(a => nickname.match(a))) {
        return NextResponse.json('forbidden', { status: 402 });
      }

      const regex = /^[가-힣a-zA-Z0-9]+$/;
      if (!regex.test(nickname) || nickname.length < 2 || nickname.length > 10) {
        return NextResponse.json('invalid', { status: 400 });
      }
      const res = await users.updateOne(
        { _id: new ObjectId(session.id) },
        {
          $set: {
            nickname: nickname ? nickname : session.nickname,
            nicknameChangedAt: now,
          },
        },
      );
      return NextResponse.json({ time: now }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { user: session } = await getUserSession();
    if (!session) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    }
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const userCollection = db.collection('users');
    const userId = new ObjectId(session.id);

    const user = await userCollection.findOne({ _id: userId });
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const { bookmarked = [], products = [] } = user;

    // 사용자가 북마크한 상품의 북마크 목록에서 해당 유저 제거
    const updateBookmarkedPromises = bookmarked.map(productId =>
      db.collection('products').updateOne({ _id: productId }, { $pull: { bookmarked: userId } }),
    );

    // 다른 사용자들이 북마크한 상품에서 해당 유저 제거, 상품 이미지, 조회 기록 제거
    const updateProductsPromises = products.map(async productId => {
      const product = await db.collection('products').findOne({ _id: productId });

      const updateProductBookmarksPromises = product.bookmarked.map(uId =>
        userCollection.updateOne({ _id: uId }, { $pull: { bookmarked: productId } }),
      );
      const deleteS3ImagesPromise = product.images.map(img => {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: extractionS3ImageKey(img),
        };
        return s3Client.send(new DeleteObjectCommand(params));
      });
      const deleteViewHistoryPromise = db.collection('viewHistory').deleteMany({ productId: productId });
      return Promise.all([...updateProductBookmarksPromises, ...deleteS3ImagesPromise, deleteViewHistoryPromise]);
    });

    const deleteUserPromises = [
      userCollection.deleteOne({ _id: userId }),
      db.collection('accounts').deleteMany({ userId: userId }),
      db.collection('sessions').deleteMany({ userId: userId }),
      db.collection('products').deleteMany({ userId: userId }),
      db.collection('viewHistory').deleteMany({ userId: userId }),
    ];

    await Promise.all([...updateBookmarkedPromises, ...updateProductsPromises, ...deleteUserPromises]);

    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal Server Error', error }, { status: 500 });
  }
}
