import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import s3Client from '@/lib/s3Client';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import { User } from '@/type/user';

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
  '운영자',
  '관리자',
  'admin',
  'keynut',
  '키넛',
];

export async function PUT(req: Request) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const users = db.collection('users');
    const products = db.collection('products');
    const session = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });
    const formData = await req.formData();
    const oldImage = JSON.parse(formData.get('oldImage').toString());
    const newImage = formData.get('newImage') as File;
    const nickname = JSON.parse(formData.get('nickname').toString());

    const deleteImage = async () => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: oldImage,
      };
      await s3Client.send(new DeleteObjectCommand(params));
    };

    let Key: string;
    const uploadImage = async () => {
      Key = `profile_${Date.now()}_${newImage.name}`;
      const arrayBuffer = await newImage.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key,
        Body: buffer,
        ContentType: newImage.type,
      };
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
    };

    if (oldImage || newImage) {
      if (oldImage) await deleteImage();
      if (newImage) await uploadImage();
      const res = await users.updateOne(
        { _id: new ObjectId(session.user.id) },
        {
          $set: {
            image: Key,
          },
        },
      );
      const resUrl = { url: Key };
      const userProducts = await products.find({ userId: new ObjectId(session.user.id) }).toArray();
      userProducts.map(({ _id }) => {
        revalidateTag(_id.toString());
      });
      return NextResponse.json(resUrl, { status: 200 });
    }

    if (nickname) {
      const now = new Date().getTime();
      const user = await users.findOne({ _id: new ObjectId(session.user.id) });
      const lastChanged = user.nicknameChangedAt ? new Date(user.nicknameChangedAt).getTime() : null;
      if (lastChanged) {
        const period = Math.floor((now - lastChanged) / (1000 * 60 * 60 * 24));
        if (period < 30) return NextResponse.json({ state: 0 }, { status: 403 });
      }
      const exisitingUser: User = await users.findOne({ nickname: nickname });
      if (exisitingUser) {
        return NextResponse.json('dup', { status: 409 });
      }
      if (forbiddenList.some(a => nickname.toLowerCase().includes(a))) {
        return NextResponse.json('forbidden', { status: 402 });
      }

      const regex = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9]+$/;

      if (!regex.test(nickname) || nickname.length < 2 || nickname.length > 10) {
        console.log(nickname.length, regex.test(nickname));
        return NextResponse.json('invalid', { status: 400 });
      }
      const res = await users.updateOne(
        { _id: new ObjectId(session.user.id) },
        {
          $set: {
            nickname: nickname ? nickname : session.user.nickname,
            nicknameChangedAt: now,
          },
        },
      );
      const userProducts = await products.find({ userId: new ObjectId(session.user.id) }).toArray();
      userProducts.map(({ _id }) => {
        revalidateTag(_id.toString());
      });
      return NextResponse.json({ time: now }, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
