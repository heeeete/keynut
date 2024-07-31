'use client';

const handleKakaoWithdrawal = async (_id, providerAccountId) => {
  try {
    const res = await fetch('/api/admin/kakao/unlink', {
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
    console.error('Caught Error:', error.message); // 에러 메시지를 출력
    throw error;
  }
};

export default handleKakaoWithdrawal;
