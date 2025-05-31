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

export interface BudgetComparisonItem {
  moneySource: string;
  budget: number;
  expense: number;
  remaining: number;
  remainingPercentage: number;
}

export interface BudgetComparison {
  comparisons: BudgetComparisonItem[];
  totalBudget: number;
  totalExpense: number;
  totalRemaining: number;
}

export interface CategoryBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface ExpenseComposition {
  categoryBreakdown: CategoryBreakdownItem[];
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

  getBudgetComparison: async (): Promise<BudgetComparison> => {
    const res = await api.get<BudgetComparison>('/dashboard/budget-comparison');
    return res.data;
  },

  getExpenseComposition: async (): Promise<ExpenseComposition> => {
    const res = await api.get<ExpenseComposition>('/dashboard/expense-composition');
    return res.data;
  },
};