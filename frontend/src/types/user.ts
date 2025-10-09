export interface User {
  id: number;
  name: string;
  email: string;
  categoryIds: number[];
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  categoryIds: number[];
}
