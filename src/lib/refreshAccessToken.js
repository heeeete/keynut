'use server';

async function refreshAccessToken(provider, refreshToken) {
  try {
    const url = provider === 'kakao' ? 'https://kauth.kakao.com/oauth/token' : 'https://nid.naver.com/oauth2.0/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('client_id', provider === 'kakao' ? process.env.KAKAO_CLIENT_ID : process.env.NAVER_CLIENT_ID);
    params.append(
      'client_secret',
      provider === 'kakao' ? process.env.KAKAO_CLIENT_SECRET : process.env.NAVER_CLIENT_SECRET,
    );
    params.append('refresh_token', refreshToken);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const refreshedTokens = await response.json();
    if (!response.ok) {
      throw refreshedTokens;
    }

    console.log(refreshedTokens);

    return {
      accessToken: refreshedTokens.access_token,
      refreshToken: refreshedTokens.refresh_token, // 갱신된 리프레시 토큰이 있는 경우
      expiresIn: refreshedTokens.expires_in,
      refreshTokenExpiresIn: refreshedTokens.refresh_token_expires_in,
    };
  } catch (error) {
    console.error('Error refreshing access token', error);

    return {
      error: 'RefreshAccessTokenError',
    };
  }
}

export default refreshAccessToken;
