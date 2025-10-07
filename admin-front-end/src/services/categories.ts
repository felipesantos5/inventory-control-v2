import axios from "axios";
import { API_URL } from "@/config/api";
import { useAuth } from "@/hooks/useAuth";
import type { Category, CreateCategoryData } from "@/types/category";

const getAuthHeaders = () => {
  const { token } = useAuth.getState();
  return {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
};

export const categoriesService = {
  getAll: async (): Promise<Category[]> => {
    const response = await axios.get(`${API_URL}/categories`, getAuthHeaders());
    return response.data;
  },

  create: async (data: CreateCategoryData): Promise<Category> => {
    const response = await axios.post(
      `${API_URL}/categories`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  update: async (
    id: string,
    data: Partial<CreateCategoryData>
  ): Promise<Category> => {
    const response = await axios.put(
      `${API_URL}/categories/${id}`,
      data,
      getAuthHeaders()
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/categories/${id}`, getAuthHeaders());
  },
};
