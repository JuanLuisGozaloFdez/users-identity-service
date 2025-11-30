export interface User {
  id: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
}
