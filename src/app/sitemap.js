import { connectDB } from '@/lib/mongodb';

async function getAllProducts() {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const products = await db.collection('products').find({}).toArray();

    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export default async function sitemap() {
  const products = await getAllProducts();

  const urls = products.map(product => ({
    url: `https://keynut.co.kr/shop/product/${product._id}`,
    lastModified: new Date(product.createdAt).toISOString(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    ...urls,
    {
      url: 'https://keynut.co.kr',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://keynut.co.kr/shop',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];
}

export const revalidate = 86400; // 24시간마다 페이지 갱신
