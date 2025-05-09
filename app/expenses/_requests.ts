import api from "../lib/Axios";

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

export const expenseRequests = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  },

  getMoneySources: async (): Promise<MoneySourceApiResponse> => {
    const res = await api.get<MoneySourceApiResponse>("/money-sources");
    return res.data;
  },

  getExpenses: async (page: number = 1, search?: string): Promise<ExpenseApiResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    if (search) params.append('search', search);
    
    const res = await api.get<ExpenseApiResponse>(`/expenses?${params.toString()}`);
    return res.data;
  },

  createExpense: async (data: PostCategory) => {
    const res = await api.post("/expenses", data);
    return res.data;
  },

  createFromText: async (text: string): Promise<ExpenseFromText> => {
    const res = await api.post<ExpenseFromText>('/expenses/from-text', { text });
    return res.data;
  },

  deleteExpense: async (id: string): Promise<void> => {
    await api.delete(`/expenses/${id}`);
  }
};
