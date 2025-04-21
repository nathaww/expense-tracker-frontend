import api from "../lib/Axios";
import { Expense } from "../money-sources/_requests";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string | null;
  isDefault: boolean;
  userId: string | null;
  expenses: Expense[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetCategoryResponse {
  id: string;
  name: string;
  icon: string;
  color: string | null;
  isDefault: boolean;
  userId: string | null;
  expenses: Expense[] | null;
  createdAt: string;
  updatedAt: string;
}

export const categoryRequests = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  },

  getCategory: async (id: string): Promise<GetCategoryResponse> => {
    const res = await api.get<GetCategoryResponse>(`/categories/${id}`);
    return res.data;
  },

  createCategory: async (data: Omit<Category, "id" | "createdAt" | "updatedAt" | "expenses">): Promise<Category> => {
    const res = await api.post<Category>("/categories", data);
    return res.data;
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const res = await api.patch<Category>(`/categories/${id}`, data);
    return res.data;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};