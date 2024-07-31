const userBanHandler = async (email, state) => {
  console.log(email, state);
  if (state !== 0 && state !== 1) {
    console.error('state는 0 또는 1만 가능합니다');
    return 500;
  }

  let res;

  try {
    res = await fetch(`/api/admin/users/ban`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, state }),
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
