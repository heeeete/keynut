import { connectDB } from '@/lib/mongodb';
import RenderShop from './renderShop';

const getProducts = async () => {
  try {
    const client = await connectDB;
    const db = client.db(process.env.MONGODB_NAME);
    const products = await db.collection('products').find({}).toArray();
    return products.reverse() || null;
  } catch (error) {
    console.error('Failed to retrieve data:', error);
  }
};

export default async function Shop() {
  const products = await getProducts();
  if (!products) {
    return <div>Product not found</div>;
  }
  return <RenderShop products={products} />;
}
