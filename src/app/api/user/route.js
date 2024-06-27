import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import s3Client from '@/lib/s3Client';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { ObjectId } from 'mongodb';
import extractionS3ImageKey from '@/app/utils/extractionS3ImageKey';
const client = await connectDB;
const db = client.db(process.env.MONGODB_NAME);
const users = db.collection('users');

export async function PUT(req) {
  try {
    const { user: session } = await getUserSession();
    let uploadedUrl = null;
    const formData = await req.formData();
    const oldImage = JSON.parse(formData.get('oldImage'));
    const newImage = formData.get('newImage');
    const nickname = JSON.parse(formData.get('nickname'));
    console.log('newImage', newImage);
    console.log('nickname', nickname);

    console.log('oldImage', oldImage);
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
        Key: `${Date.now()}_${newImage.name}`,
        Body: buffer,
        ContentType: newImage.type,
      };
      const command = new PutObjectCommand(uploadParams);
      await s3Client.send(command);
      const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
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
      const res = await users.updateOne(
        { _id: new ObjectId(session.id) },
        {
          $set: {
            nickname: nickname ? nickname : session.nickname,
          },
        },
      );
      return NextResponse.json(res, { status: 200 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
