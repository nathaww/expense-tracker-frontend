import api from "../lib/Axios";

export interface Expense {
  id: string;
  amount: number;
  amountInPreferredCurrency: number;
  date: string;
  notes: string;
  categoryId: string;
  moneySourceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BalanceHistory {
  id: string;
  date: string;
  balance: number;
  balanceInPreferredCurrency: number;
  currency: string;
  userId: string;
  createdAt: string;
}

export interface MoneySource {
  id: string;
  name: string;
  balance: number;
  balanceInPreferredCurrency: number;
  currency: string;
  icon: string;
  isDefault: boolean;
  budget: number;
  budgetInPreferredCurrency: number;
  cardStyle?: string; // Add card style ID
  expenses: Expense[];
  balanceHistories: BalanceHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface MoneySourceApiResponse {
  data: MoneySource[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface CardStyle {
  styleId: string;
  name: string;
  // background can be either a direct string, a stringified JSON, or an object
  background: string | { [key: string]: string };
  textColor: string;
  cardNumberFont: string;
  border: string;
  shadow: string;
  hasChip: boolean;
  chipColor: string;
  visaLogoVariant: string;
  showBgImage: boolean;
}

export interface MoneySourceFilterParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filterField?: string;
  filterValue?: string;
  rangeField?: string;
  minValue?: number;
  maxValue?: number;
  multiValueField?: string;
  multiValues?: Array<string | number>;
  dateField?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export const moneySourceRequests = {
  getMoneySources: async (params?: MoneySourceFilterParams): Promise<MoneySourceApiResponse> => {
    const res = await api.get<MoneySourceApiResponse>('/money-sources', { params });
    return res.data;
  },
  
  createMoneySource: async (data: Omit<MoneySource, 'id' | 'createdAt' | 'updatedAt' | 'expenses' | 'balanceHistories'>): Promise<MoneySource> => {
    const res = await api.post<MoneySource>('/money-sources', data);
    return res.data;
  },

  updateMoneySource: async (id: string, data: Partial<MoneySource>): Promise<MoneySource> => {
    const res = await api.patch<MoneySource>(`/money-sources/${id}`, data);
    return res.data;
  },

  deleteMoneySource: async (id: string): Promise<void> => {
    await api.delete(`/money-sources/${id}`);
  },

  getCardStyles: async (): Promise<CardStyle[]> => {
    const res = await api.get<CardStyle[]>('/money-sources/card-styles');
    return res.data;
  },
};

