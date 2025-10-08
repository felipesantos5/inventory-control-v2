export interface DecodedToken {
  exp: number;
  iat: number;
  sub: string;
  // Adicione outros campos conforme sua API
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
