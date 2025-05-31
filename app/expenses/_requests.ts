import api from "../lib/Axios";
import { BaseFilterParams } from "@/components/UI/FilterToolbar";

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string | null;
  isDefault: boolean;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PostCategory {
  amount: number;
  date: string;
  notes: string;
  categoryId: string;
  moneySourceId: string;
}

export interface MoneySourceApiResponse {
  data: MoneySource[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface MoneySource {
  id: string;
  name: string;
  balance: number;
  currency: string;
  icon: string;
  isDefault: boolean;
  budget: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFromText {
  amount: number;
  date: string;
  notes: string;
  categoryId: string;
  category: Category;
  moneySourceId: string;
  moneySource: MoneySource;
}

export interface Expense {
  id: string;
  amount: number;
  amountInPreferredCurrency: number;
  date: string;
  notes: string;
  categoryId: string;
  category: Category;
  moneySourceId: string;
  moneySource: MoneySource;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseApiResponse {
  data: Expense[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface ExpenseFilterParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filterField?: string;
  filterValue?: string;
  rangeField?: string;
  minValue?: number;
  maxValue?: number;
  multiValueField?: string;
  multiValues?: string[] | number[];
  dateField?: string;
  startDate?: string;
  endDate?: string;
}

export const expenseRequests = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  },
  getMoneySources: async (): Promise<MoneySourceApiResponse> => {
    const res = await api.get<MoneySourceApiResponse>("/money-sources");
    return res.data;
  },
  getExpenses: async (filters: BaseFilterParams = { page: 1 }): Promise<ExpenseApiResponse> => {
    const params = new URLSearchParams();
    
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    const res = await api.get<ExpenseApiResponse>(`/expenses?${params.toString()}`);
    return res.data;
  },
  createExpense: async (data: PostCategory) => {
    const res = await api.post("/expenses", data);
    return res.data;
  },

  updateExpense: async (id: string, data: PostCategory): Promise<Expense> => {
    const res = await api.patch<Expense>(`/expenses/${id}`, data);
    return res.data;
  },

  createFromText: async (text: string): Promise<ExpenseFromText> => {
    const res = await api.post<ExpenseFromText>('/expenses/from-text', { text });
    return res.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  },

  bulkDeleteExpenses: async (ids: string[]): Promise<void> => {
    await api.delete("/expenses/bulk", { data: { ids } });
  }
};
