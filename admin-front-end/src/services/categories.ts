import { api } from "@/lib/axios";
import type { Category, CreateCategoryData } from "@/types/category";

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const response = await api.get("/categories");
    return response.data;
  },

  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await api.post("/categories", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateCategoryData>
  ): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
