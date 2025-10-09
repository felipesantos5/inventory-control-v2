import { api } from "@/lib/axios";
import type { User, CreateUserRequest } from "@/types/user";

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get("/users");
    return response.data;
  },

  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await api.post("/users", data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};
