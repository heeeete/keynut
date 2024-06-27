import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/s3Client';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';
import extractionS3ImageKey from '@/app/utils/extractionS3ImageKey';

const client = await connectDB;
const db = client.db(process.env.MONGODB_NAME);
const products = db.collection('products');
const users = db.collection('users');

const priceRanges = [
  { id: 1, min: 0, max: 50000 },
  { id: 2, min: 50000, max: 100000 },
  { id: 3, min: 100000, max: 300000 },
  { id: 4, min: 300000, max: 500000 },
  { id: 5, min: 500000, max: Infinity },
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url, `${process.env.NEXT_PUBLIC_BASE_URL}`);
    const keywordParam = searchParams.get('keyword');
    const categoriesParam = searchParams.get('categories');
    const pricesParam = searchParams.get('prices');

    const categories = categoriesParam ? categoriesParam.split(',').map(Number) : [];
    const prices = pricesParam ? pricesParam.split(',').map(Number) : [];
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    let query = {};

    if (keywordParam) {
      //해시태그일 경우 해시태그에서 검색
      if (keywordParam[0] == '#') {
        const hashTag = keywordParam.split(' ')[0];
        query.tags = { $elemMatch: { $eq: hashTag } };
      } else query.title = { $regex: keywordParam, $options: 'i' };
    }
    if (categories.length > 0) {
      if (categories.includes(1)) {
        categories.push(10, 11, 12, 13, 14, 15, 19);
      }
      query.category = { $in: categories };
    }

    if (prices.length > 0) {
      const priceConditions = prices.map(priceId => {
        const range = priceRanges.find(range => range.id === priceId);
        return { price: { $gte: range.min, $lte: range.max } };
      });
      query.$or = priceConditions;
    }

    const products = await db.collection('products').find(query).sort({ createdAt: -1 }).toArray();
    if (products) {
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
    const { user: session } = await getUserSession();

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
      category: Number(formData.get('subCategory')),
      condition: Number(formData.get('condition')),
      description: formData.get('description'),
      price: Number(formData.get('price')),
      images: uploadedUrls,
      bookmarked: [],
      openChatUrl: formData.get('openChatUrl'),
      tags: formData.get('tags'),
      views: 0, // 초기 조회수는 0
      state: 1,
      createdAt: new Date(),
    };
    product.tags = product.tags.length ? product.tags.split(',') : [];

    const result = await products.insertOne(product);
    await users.updateOne(
      { email: session.email },
      {
        $set: { openChatUrl: formData.get('openChatUrl') },
        $addToSet: {
          products: result.insertedId,
        },
      },
    );
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { user: session } = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });
    const formData = await req.formData();
    const deleteFiles = formData.getAll('deleteFiles');
    const uploadFiles = formData.getAll('uploadFiles');
    const uploadedUrls = [];

    const deletePromises = deleteFiles.map(file => {
      const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        Key: extractionS3ImageKey(file),
      };
      return s3Client.send(new DeleteObjectCommand(params)); // Promise 반환
    });

    const uploadPromises = uploadFiles.map(async file => {
      if (typeof file === 'object') {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadParams = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: `${Date.now()}_${file.name}`,
          Body: buffer,
          ContentType: file.type,
        };
        const command = new PutObjectCommand(uploadParams);

        await s3Client.send(command);
        const url = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
        uploadedUrls.push(url);
      } else {
        uploadedUrls.push(file); // 이미 업로드된 파일의 URL
      }
    });

    await Promise.all([...deletePromises, ...uploadPromises]);
    await users.updateOne({ email: session.email }, { $set: { openChatUrl: formData.get('openChatUrl') } });
    const result = await products.updateOne(
      { _id: new ObjectId(formData.get('id')) },
      {
        $set: {
          title: formData.get('title'),
          category: Number(formData.get('subCategory')),
          condition: Number(formData.get('condition')),
          description: formData.get('description'),
          price: Number(formData.get('price')),
          images: uploadedUrls,
          openChatUrl: formData.get('openChatUrl'),
          tags: formData.get('tags').split(','),
          updatedAt: new Date(),
        },
      },
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
