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

export const expenseRequests = {
  getCategories: async (): Promise<Category[]> => {
    const res = await api.get<Category[]>("/categories");
    return res.data;
  },

  getMoneySources: async (): Promise<MoneySourceApiResponse> => {
    const res = await api.get<MoneySourceApiResponse>("/money-sources");
    return res.data;
  },

  createExpense: async (data: PostCategory) => {
    const res = await api.post("/expenses", data);
    return res.data;
  },

  createFromText: async (text: string): Promise<ExpenseFromText> => {
    const res = await api.post<ExpenseFromText>('/expenses/from-text', { text });
    return res.data;
  }
};
