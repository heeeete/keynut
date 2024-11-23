const userBanHandler = async (email: string, state: number, expires_at?: number) => {
  if (state !== 0 && state !== 1) {
    console.error('state는 0 또는 1만 가능합니다');
    return 500;
  }

  let res: Response;

  try {
    res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/users/ban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, state, expires_at }),
    });

    if (res.ok) {
      return 200;
    } else {
      const data = await res.json();
      throw new Error(data.error);
    }
  } catch (error) {
    console.error(error);
    return res ? res.status : 500; // res가 정의되지 않았을 경우 500 반환
  }
};

export default userBanHandler;
