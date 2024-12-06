import { NextResponse } from 'next/server';
import connectDB from '@keynut/lib/mongodb';

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
      const priceConditions = prices.map((priceId) => {
        const range = priceRanges.find((range) => range.id === priceId);
        return { price: { $gte: range.min, $lte: range.max } };
      });
      query.$and = [{ $or: priceConditions }];
    }

    const products = await db
      .collection('products')
      .find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip((curPage - 1) * 48)
      .limit(48)
      .toArray();

    let allProducts = -1;
    let unBookedProducts = -1;
    if (products && curPage) {
      allProducts = await db.collection('products').countDocuments(query);
      unBookedProducts = await db.collection('products').countDocuments({
        ...query,
        state: { $ne: 2 },
      });
    }

    if (products) {
      return NextResponse.json({ products, allProducts, unBookedProducts }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No products found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
