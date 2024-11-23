import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/s3Client';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import getUserSession from '@/lib/getUserSession';
import { ObjectId } from 'mongodb';
import { revalidatePath, revalidateTag } from 'next/cache';
import checkBannedEmail from '@/lib/checkBannedEmail';
import { User } from '@/type/user';

const priceRanges = [
  { id: 1, min: 0, max: 50000 },
  { id: 2, min: 50000, max: 100000 },
  { id: 3, min: 100000, max: 300000 },
  { id: 4, min: 300000, max: 500000 },
  { id: 5, min: 500000, max: Infinity },
];

const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
export async function GET(req: Request) {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);

    const { searchParams } = new URL(req.url, `${process.env.NEXT_PUBLIC_BASE_URL}`);
    let keywordParam = searchParams.get('keyword');
    const categoriesParam = searchParams.get('categories');
    const pricesParam = searchParams.get('prices');
    const curPage = Number(searchParams.get('lastPage'));
    // const lastProductCreatedAt = searchParams.get('lastCreatedAt');
    const categories = categoriesParam ? categoriesParam.split(',').map(Number) : [];
    const prices = pricesParam ? pricesParam.split(',').map(Number) : [];
    let query: Record<string, any> = { $or: [{ state: 1 }, { state: 2 }] };

    if (keywordParam) {
      if (keywordParam[0] == '#') {
        keywordParam = keywordParam.replaceAll(' ', '');
        const hashTag = keywordParam.split(' ')[0];
        query.tags = { $elemMatch: { $eq: hashTag } };
      } else {
        const escapedKeyword = escapeRegExp(keywordParam);
        query.title = { $regex: escapedKeyword, $options: 'i' };
      }
    }

    if (categories.length > 0) {
      if (categories.includes(1)) {
        categories.push(10, 11, 12, 13, 14, 15, 16, 19);
      }
      if (categories.includes(2)) {
        categories.push(20, 21, 22, 23, 29);
      }
      if (categories.includes(3)) {
        categories.push(30, 31, 39);
      }
      query.category = { $in: categories };
    }

    if (prices.length > 0) {
      const priceConditions = prices.map(priceId => {
        const range = priceRanges.find(range => range.id === priceId);
        return { price: { $gte: range.min, $lte: range.max } };
      });
      query.$and = [{ $or: priceConditions }];
    }

    // if (lastProductCreatedAt && lastProductId) {
    //   query.$and = query.$and || [];
    //   query.$and.push({
    //     $or: [
    //       { createdAt: { $lt: new Date(lastProductCreatedAt) } },
    //       { createdAt: new Date(lastProductCreatedAt), _id: { $lt: new ObjectId(lastProductId) } },
    //     ],
    //   });
    // }

    const products = await db
      .collection('products')
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip((curPage - 1) * 48)
      .limit(48)
      .toArray();


    if (products) {
      return NextResponse.json(products, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

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

    console.log(deleteFiles);

    await Promise.all(
      deleteFiles.map(file => {
        const params = {
          Bucket: process.env.S3_BUCKET_NAME,
          Key: file as string,
        };
        return s3Client.send(new DeleteObjectCommand(params));
      }),
    );

    await users.updateOne({ email: session.user.email }, { $set: { openChatUrl: formData.get('openChatUrl') } });
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
