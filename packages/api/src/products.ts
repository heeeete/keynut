import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Products API', products: [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  return NextResponse.json({ message: 'Product created', body });
}
