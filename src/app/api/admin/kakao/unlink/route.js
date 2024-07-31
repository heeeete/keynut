import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { providerAccountId, _id } = await req.json();

    console.log(providerAccountId, _id);

    const body = new URLSearchParams({
      target_id_type: 'user_id',
      target_id: providerAccountId,
    });

    const res = await fetch('https://kapi.kakao.com/v1/user/unlink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `KakaoAK ${process.env.KAKAO_APP_ADMIN_KEY}`,
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error(errorData);
      return NextResponse.json({ error: errorData }, { status: res.status });
    }

    const res2 = await fetch(`${process.env.NEXTAUTH_URL}/api/user/${_id}`, { method: 'DELETE' });
    if (!res2.ok) {
      const error = await res2.json();
      return NextResponse.json({ error: error }, { status: res2.status });
    }
    return NextResponse.json({}, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
