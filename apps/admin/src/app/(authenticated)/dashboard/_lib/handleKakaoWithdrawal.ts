'use client';

const handleKakaoWithdrawal = async (_id: string, providerAccountId: string) => {
  try {
    const res = await fetch('/api/kakao/unlink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ providerAccountId, _id }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Kakao API Error:', errorData.error);
      throw new Error(errorData.error);
    }
  } catch (error) {
    console.error(error); // 에러 메시지를 출력
    throw error;
  }
};

export default handleKakaoWithdrawal;
