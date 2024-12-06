import connectDB from '@keynut/lib/mongodb';

export async function findUserByEmail(email: string) {
  const client = await connectDB;
  const db = client.db(process.env.MONGODB_NAME);
  return await db.collection('users').findOne({ email: email });
}
