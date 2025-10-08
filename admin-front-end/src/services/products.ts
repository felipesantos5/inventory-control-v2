import { api } from "@/lib/axios";
import type { Product, CreateProductData } from "@/types/product";

export const productsService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data;
  },

  create: async (data: CreateProductData): Promise<Product> => {
    const response = await api.post("/products", data);
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateProductData>
  ): Promise<Product> => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};
