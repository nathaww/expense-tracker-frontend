import api from "../lib/Axios";

export interface CategoryComparison {
  categoryName: string;
  userAmount: number;
  averageAmount: number;
  percentageDifference: number;
  currency: string;
}

export interface SpendingComparison {
  insights: string;
  categoryComparisons: CategoryComparison[];
  overallDifferencePercentage: number;
  comparisonUserCount: number;
  userMonthlySpending: number;
  averageMonthlySpending: number;
  currency: string;
}

export const userInsightsRequests = {
  getSpendingComparison: async (): Promise<SpendingComparison> => {
    const res = await api.get<SpendingComparison>('/user-insights/spending-comparison');
    return res.data;
  }
};