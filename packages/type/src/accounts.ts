export interface NaverAccounts {
  _id: string;
  provider: string;
  type: string;
  providerAccountId: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_at: number;
  userId: string;
}

export interface KakaoAccounts {
  _id: string;
  provider: string;
  type: string;
  providerAccountId: string;
  access_token: string;
  token_type: string;
  refresh_token: string;
  expires_at: number;
  userId: string;
  scope: string;
  refresh_token_expires_in: string;
}
