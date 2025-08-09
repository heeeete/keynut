import { PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import s3Client from '@keynut/lib/s3Client';
import { NextResponse } from 'next/server';

interface ImageDetails {
  file?: File;
  name?: string;
  width: number;
  height: number;
}

export async function POST(req: Request) {
  try {
    const { imageDetails }: { imageDetails: ImageDetails[] } = await req.json();
    const urls = await Promise.all(
      imageDetails.map(async (image) => {
        const command = new PutObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: image.name,
        });
        const url = await getSignedUrl(s3Client, command, { expiresIn: 15 * 60 });
        return url;
      }),
    );
    return NextResponse.json({ urls }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
9;
