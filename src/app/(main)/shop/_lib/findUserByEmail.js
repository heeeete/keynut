import { connectDB } from '@/lib/mongodb';

export async function findUserByEmail(email) {
  const client = await connectDB;
  const db = client.db(process.env.MONGODB_NAME);
  return await db.collection('users').findOne({ email: email });
}
