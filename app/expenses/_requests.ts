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
  getExpenses: async (filters: ExpenseFilterParams = { page: 1 }): Promise<ExpenseApiResponse> => {
    const params = new URLSearchParams();
    
    // Add all filter parameters
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.filterField) params.append('filterField', filters.filterField);
    if (filters.filterValue) params.append('filterValue', filters.filterValue);
    if (filters.rangeField) params.append('rangeField', filters.rangeField);
    if (filters.minValue !== undefined) params.append('minValue', filters.minValue.toString());
    if (filters.maxValue !== undefined) params.append('maxValue', filters.maxValue.toString());
    if (filters.multiValueField) params.append('multiValueField', filters.multiValueField);
    if (filters.multiValues) {
      filters.multiValues.forEach(value => params.append('multiValues', value.toString()));
    }
    if (filters.dateField) params.append('dateField', filters.dateField);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    
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
