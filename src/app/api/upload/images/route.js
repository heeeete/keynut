import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import formidable, { errors as formidableErrors } from 'formidable';

import fs from 'fs';
import { NextResponse } from 'next/server';

// AWS S3 설정
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadToS3 = async file => {
  const fileStream = fs.createReadStream(file.filepath);
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalFilename}`,
    Body: fileStream,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(uploadParams);
  return await s3Client.send(command);
};

export async function POST(req, res) {
  console.log(req.formData());

  return new NextResponse({ message: 'hello' });
}
