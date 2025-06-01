import { DashboardOverview, DashboardTrends, BudgetComparison, ExpenseComposition } from '@/app/dashboard/_requests';

export interface AnalyticsInsight {
  title: string;
  value: string;
  change: {
    value: number;
    isPositive: boolean;
    period: string;
  };
  data: number[];
}

export interface ComputedAnalytics {
  monthlyTrends: AnalyticsInsight;
  categoryDistribution: AnalyticsInsight;
  budgetHealth: AnalyticsInsight;
}

export class AnalyticsService {
  static computeAnalytics(
    overview: DashboardOverview,
    trends: DashboardTrends,
    budgetComparison: BudgetComparison,
    expenseComposition: ExpenseComposition
  ): ComputedAnalytics {
    return {
      monthlyTrends: this.computeMonthlyTrends(trends),
      categoryDistribution: this.computeCategoryDistribution(expenseComposition),
      budgetHealth: this.computeBudgetHealth(overview, budgetComparison),
    };
  }

  private static computeMonthlyTrends(trends: DashboardTrends): AnalyticsInsight {
    const monthlyData = trends.monthlyTrends;
    const data = monthlyData.map(item => item.amount);
    
    // Calculate month-over-month change
    let changePercentage = 0;
    let isPositive = true;
    
    if (monthlyData.length >= 2) {
      const currentMonth = monthlyData[monthlyData.length - 1].amount;
      const previousMonth = monthlyData[monthlyData.length - 2].amount;
      
      if (previousMonth > 0) {
        changePercentage = ((currentMonth - previousMonth) / previousMonth) * 100;
        isPositive = changePercentage >= 0;
      }
    }    return {
      title: "Monthly Trends",
      value: `${Math.abs(changePercentage).toFixed(2)}%`,
      change: {
        value: parseFloat(Math.abs(changePercentage).toFixed(2)),
        isPositive,
        period: "vs last month"
      },
      data
    };
  }

  private static computeCategoryDistribution(expenseComposition: ExpenseComposition): AnalyticsInsight {
    const categories = expenseComposition.categoryBreakdown;
    const data = categories.map(item => item.percentage);
    const activeCategoriesCount = categories.length;
    
    // Calculate change based on category diversity (more categories = better distribution)
    const diversityScore = activeCategoriesCount >= 5 ? 1 : 0;
    
    return {
      title: "Category Distribution",
      value: `${activeCategoriesCount} Categories`,
      change: {
        value: activeCategoriesCount,
        isPositive: diversityScore === 1,
        period: "active"
      },
      data
    };
  }
  private static computeBudgetHealth(overview: DashboardOverview, budgetComparison: BudgetComparison): AnalyticsInsight {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _unused = budgetComparison; // Reserved for future budget comparison logic
    
    let utilizationPercentage = overview.budgetUtilization;
    
    // Fix budget calculation: if value is small, it's likely a decimal that needs conversion
    if (utilizationPercentage <= 10) {
      utilizationPercentage = utilizationPercentage * 100;
    }
    
    // Cap at reasonable maximum
    utilizationPercentage = Math.min(utilizationPercentage, 999);
    
    const isOverBudget = utilizationPercentage > 100;
    const budgetHealthScore = Math.min(utilizationPercentage, 100);
    
    // Calculate how much over/under budget
    const budgetVariance = Math.abs(utilizationPercentage - 100);
    
    return {
      title: "Budget Health",
      value: `${budgetHealthScore.toFixed(2)}%`,
      change: {
        value: parseFloat(budgetVariance.toFixed(2)),
        isPositive: !isOverBudget,
        period: isOverBudget ? "over budget" : "under budget"
      },
      data: [budgetHealthScore]
    };
  }
  static computeTrendDirection(data: number[]): { isPositive: boolean; changeValue: number } {
    if (data.length < 2) return { isPositive: true, changeValue: 0 };
    
    const recent = data.slice(-3); // Last 3 data points
    const earlier = data.slice(-6, -3); // Previous 3 data points
    
    const recentAvg = recent.reduce((sum, val) => sum + val, 0) / recent.length;
    const earlierAvg = earlier.length > 0 
      ? earlier.reduce((sum, val) => sum + val, 0) / earlier.length 
      : recentAvg;
    
    const changeValue = earlierAvg > 0 ? parseFloat((Math.abs((recentAvg - earlierAvg) / earlierAvg) * 100).toFixed(2)) : 0;
    const isPositive = recentAvg >= earlierAvg;
    
    return { isPositive, changeValue };
  }
}
