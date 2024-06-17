import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/app/utils/getUserSession';
import { ObjectId } from 'mongodb';

const client = await connectDB;
const db = client.db(process.env.MONGODB_NAME);
const collection = db.collection('products');
const users = db.collection('users');

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const products = await db.collection('products').find({}).sort({ createdAt: -1 }).toArray();

    if (products.length > 0) {
      return NextResponse.json(products, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
  // finally {
  //   // Ensure the client is closed to prevent memory leaks
  //   if (client) {
  //     await client.close();
  //   }
  // }
}

export async function POST(req) {
  try {
    const session = await getUserSession();
    console.log(session);

    const formData = await req.formData();
    const files = formData.getAll('files');

    const uploadPromises = [];
    const uploadedUrls = [];

    for (const file of files) {
      // 각 파일에 대해 루프를 시작합니다. files는 formData.getAll('files')를 통해 가져온 파일 리스트입니다.
      const arrayBuffer = await file.arrayBuffer();
      // 파일을 ArrayBuffer로 변환합니다. ArrayBuffer는 바이너리 데이터를 저장할 수 있는 일반적인 버퍼입니다.

      const buffer = Buffer.from(arrayBuffer);
      // ArrayBuffer를 Node.js Buffer 객체로 변환합니다. Node.js Buffer 객체는 S3에 업로드할 수 있는 형태의 바이너리 데이터를 나타냅니다.

      const uploadParams = {
        Bucket: process.env.S3_BUCKET_NAME,
        // 업로드할 S3 버킷의 이름입니다. 환경 변수로 설정된 값을 사용합니다.

        Key: `${Date.now()}_${file.name}`,
        // S3에 저장될 객체의 키(파일 이름)입니다. 여기서는 파일 이름 앞에 현재 타임스탬프를 붙여서 고유한 파일 이름을 생성합니다.

        Body: buffer,
        // 업로드할 파일의 내용입니다. Buffer 객체를 사용합니다.

        ContentType: file.type,
        // 파일의 MIME 타입입니다. 클라이언트에서 업로드된 파일의 타입을 그대로 사용합니다.
      };

      const command = new PutObjectCommand(uploadParams);
      // S3에 파일을 업로드하는 명령을 생성합니다. AWS SDK v3의 PutObjectCommand를 사용합니다.

      const uploadPromise = s3Client
        .send(command)
        .then(() => {
          const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
          // 파일이 성공적으로 업로드된 후 해당 파일의 URL을 생성합니다.
          // S3 버킷의 URL 형식을 사용합니다. 'https://{버킷 이름}.s3.{리전}.amazonaws.com/{파일 키}'

          uploadedUrls.push(url);
          // 생성된 URL을 uploadedUrls 배열에 추가합니다.
        })
        .catch(error => {
          console.error(`Error uploading file ${file.name}:`, error);
          // 업로드 중 오류가 발생한 경우, 오류 메시지를 출력합니다.
        });

      uploadPromises.push(uploadPromise);
      // 각 업로드 작업을 Promise 배열에 추가합니다. 모든 파일 업로드 작업이 완료될 때까지 기다리기 위해 Promise.all을 사용할 것입니다.
    }

    await Promise.all(uploadPromises);

    const product = {
      userId: new ObjectId(session.id), // 사용자 ID 추가
      title: formData.get('title'),
      category: formData.get('subCategory'),
      condition: formData.get('condition'),
      description: formData.get('description'),
      price: formData.get('price'),
      images: uploadedUrls,
      bookmarked: [],
      openChatUrl: formData.get('openChatUrl'),
      createdAt: new Date(),
    };

    await users.updateOne({ email: session.email }, { $set: { openChatUrl: formData.get('openChatUrl') } });
    const result = await collection.insertOne(product);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: '상품 DB로 업로드중 문제 발생' }, { status: 500 });
  }
}
