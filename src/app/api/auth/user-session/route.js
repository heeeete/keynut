import { getServerSession } from 'next-auth';
import { authOptions } from '../[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json({ session }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
