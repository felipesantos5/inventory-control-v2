export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
