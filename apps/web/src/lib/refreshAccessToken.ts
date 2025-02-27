'use server';

async function refreshAccessToken(provider: string, refreshToken: string) {
  try {
    const url =
      provider === 'kakao'
        ? 'https://kauth.kakao.com/oauth/token'
        : 'https://nid.naver.com/oauth2.0/token';

    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append(
      'client_id',
      provider === 'kakao'
        ? (process.env.KAKAO_CLIENT_ID as string)
        : (process.env.NAVER_CLIENT_ID as string),
    );
    params.append(
      'client_secret',
      provider === 'kakao'
        ? (process.env.KAKAO_CLIENT_SECRET as string)
        : (process.env.NAVER_CLIENT_SECRET as string),
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

    return {
      access_token: refreshedTokens.access_token,
      refresh_token: refreshedTokens.refresh_token,
      expires_in: refreshedTokens.expires_in,
      refresh_token_expires_in: refreshedTokens.refresh_token_expires_in,
    };
  } catch (error) {
    console.error('Error refreshing access token', error);

    return {
      error: 'RefreshAccessTokenError',
    };
  }
}

export default refreshAccessToken;
