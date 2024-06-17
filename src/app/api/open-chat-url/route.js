import { NextResponse } from 'next/server';
import getUserSession from '@/app/utils/getUserSession';
import { findUserByEmail } from '@/app/shop/_lib/findUserByEmail';

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) return NextResponse.json({ error: 'No session found' }, { status: 401 });
    const user = await findUserByEmail(session.email);
    if (user) return NextResponse.json(user, { status: 200 });
    else return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: '유저DB 조회 에러' }, { status: 500 });
  }
}
