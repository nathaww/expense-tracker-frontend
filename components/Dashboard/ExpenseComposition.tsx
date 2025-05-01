"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardRequests, CategoryBreakdownItem } from "@/app/dashboard/_requests";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from "chart.js";
import { formatCurrency } from "../utils/formatCurrency";

ChartJS.register(ArcElement, Tooltip, Legend);

const generateRandomColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsla(${(i * 360) / count}, 70%, 60%, 0.8)`);
  }
  return colors;
};

interface ExpenseCompositionProps {
  currencyType: string;
  hideAmount: boolean;
}

const CategoryTable = ({ 
  data,
  currencyType,
  hideAmount
}: { 
  data: CategoryBreakdownItem[];
  currencyType: string;
  hideAmount: boolean;
}) => {
  return (
    <div className="overflow-auto max-h-[300px] mt-4">
      <table className="w-full text-sm">
        <thead className="text-left">
          <tr className="border-b border-[var(--border-color)]">
            <th className="py-2 px-3">Category</th>
            <th className="py-2 px-3">Amount</th>
            <th className="py-2 px-3">Percentage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`border-b border-[var(--border-color)] ${
                index % 2 === 0 ? "bg-[var(--bg)]" : "bg-[var(--bgSecondary)]"
              }`}
            >
              <td className="py-2 px-3 font-medium">{item.category}</td>
              <td className="py-2 px-3">{formatCurrency(item.amount, currencyType, hideAmount)}</td>
              <td className="py-2 px-3">{item.percentage.toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function ExpenseComposition({ currencyType, hideAmount }: ExpenseCompositionProps) {
  const {
    data: composition,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard-expense-composition"],
    queryFn: dashboardRequests.getExpenseComposition,
  });

  // Get computed CSS values
  const textColor = typeof window !== 'undefined' ? 
    getComputedStyle(document.documentElement).getPropertyValue('--text').trim() : '#1f2937';
  const bgColor = typeof window !== 'undefined' ? 
    getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() : '#ffffff';

  if (isLoading) {
    return (
      <div className="animate-pulse p-6 rounded-[var(--border-radius)] bg-[var(--bgSecondary)] h-[400px]" />
    );
  }

  if (isError || !composition) {
    return (
      <div className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bgSecondary)]">
        <p className="text-[var(--text)]">Failed to load expense composition data</p>
      </div>
    );
  }

  const pieData = {
    labels: composition.categoryBreakdown.map((item) => item.category),
    datasets: [
      {
        data: composition.categoryBreakdown.map((item) => item.amount),
        backgroundColor: generateRandomColors(composition.categoryBreakdown.length),
        borderColor: bgColor,
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: textColor,
          padding: 15,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"pie">) {
            const label = context.label || "";
            const value = Number(context.raw);
            const item = composition.categoryBreakdown.find(
              (c) => c.category === label
            );
            const percentage = item ? item.percentage.toFixed(1) : "0.0";
            return `${label}: ${formatCurrency(value, currencyType, hideAmount)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Calculate total amount
  const totalAmount = composition.categoryBreakdown.reduce(
    (total, item) => total + item.amount,
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md"
    >
      <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Expense Composition</h3>
      
      <div className="flex flex-col lg:flex-row gap-6 items-center">
        <div className="w-full lg:w-1/2">
          <div className="h-[300px] flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
        
        <div className="w-full lg:w-1/2">
          <CategoryTable 
            data={composition.categoryBreakdown} 
            currencyType={currencyType} 
            hideAmount={hideAmount}
          />
          
          <div className="mt-4 p-4 bg-[var(--bgSecondary)] rounded-[var(--border-radius)]">
            <h4 className="font-semibold mb-2 text-[var(--text)]">Summary</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm text-[var(--text)]/60">Total Expenses</span>
              <span className="font-bold">{formatCurrency(totalAmount, currencyType, hideAmount)}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}