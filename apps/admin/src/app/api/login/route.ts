// import getHashPW from '@/app/(authenticated)/dashboard/_utils/hashPassword';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function authenticationSuccess() {
  const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  const response = NextResponse.json({ message: '인증 성공' }, { status: 200 });

  // 쿠키 설정
  response.cookies.set('auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'strict',
    maxAge: 3600,
  });

  return response; // 수정된 응답 객체 반환
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const id: string = formData.get('id') as string;
  const pw: string = formData.get('pw') as string;
  const adminUsers = JSON.parse(process.env.ADMIN_USERS!);

  if (!adminUsers[id]) {
    return NextResponse.json({ message: '인증 실패' }, { status: 401 });
  } else {
    const hashedPassword = Buffer.from(adminUsers[id], 'base64').toString('utf-8');
    const isValid = await bcrypt.compare(pw, hashedPassword);
    if (!isValid) {
      return NextResponse.json({ message: '인증 실패' }, { status: 401 });
    }
  }

  return authenticationSuccess();
}
