import api from "../lib/Axios";

export interface DashboardOverview {
  totalExpenses: number;
  totalBudget: number;
  totalBalance: number;
  budgetUtilization: number;
}

export interface TrendData {
  date: string;
  amount: number;
}

export interface DashboardTrends {
  monthlyTrends: TrendData[];
  weeklyTrends: TrendData[];
}

export const dashboardRequests = {
  getOverview: async (): Promise<DashboardOverview> => {
    const res = await api.get<DashboardOverview>('/dashboard/overview');
    return res.data;
  },
  
  getTrends: async (): Promise<DashboardTrends> => {
    const res = await api.get<DashboardTrends>('/dashboard/trends');
    return res.data;
  },
};