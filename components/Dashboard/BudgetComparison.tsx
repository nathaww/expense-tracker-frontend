"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardRequests, BudgetComparisonItem } from "@/app/dashboard/_requests";
import { motion } from "framer-motion";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from "chart.js";
import { formatCurrency } from "../utils/formatCurrency";
import React, { useEffect } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

const generateRandomColors = (count: number) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
        colors.push(`hsla(${(i * 360) / count}, 70%, 60%, 0.8)`);
    }
    return colors;
};

const ComparisonTable = ({ 
    data, 
    currencyType, 
    hideAmount 
}: { 
    data: BudgetComparisonItem[]; 
    currencyType: string;
    hideAmount: boolean;
}) => {
    return (
        <div className="overflow-auto max-h-[250px] mt-4">
            <table className="w-full text-sm">
                <thead className="text-left">
                    <tr className="border-b border-[var(--border-color)]">
                        <th className="py-2 px-3">Money Source</th>
                        <th className="py-2 px-3">Budget</th>
                        <th className="py-2 px-3">Actual</th>
                        <th className="py-2 px-3">Variance</th>
                        <th className="py-2 px-3">%</th>
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
                            <td className="py-2 px-3 font-medium">{item.moneySource}</td>
                            <td className="py-2 px-3">{formatCurrency(item.budget, currencyType, hideAmount)}</td>
                            <td className="py-2 px-3">{formatCurrency(item.actual, currencyType, hideAmount)}</td>
                            <td className="py-2 px-3">{formatCurrency(item.variance, currencyType, hideAmount)}</td>
                            <td className="py-2 px-3">{item.variancePercentage.toFixed(1)}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface BudgetComparisonProps {
  currencyType: string;
  hideAmount: boolean;
}

export default function BudgetComparison({ currencyType, hideAmount }: BudgetComparisonProps) {
    const {
        data: comparison,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryKey: ["dashboard-budget-comparison"],
        queryFn: dashboardRequests.getBudgetComparison,
    });

    // Listen for currency and hide/show changes
    useEffect(() => {
        const handleCurrencyChange = () => {
            refetch();
        };
        
        const handleHideAmountsChange = () => {
            refetch();
        };
        
        window.addEventListener('currencychange', handleCurrencyChange);
        window.addEventListener('hideamountschange', handleHideAmountsChange);
        
        return () => {
            window.removeEventListener('currencychange', handleCurrencyChange);
            window.removeEventListener('hideamountschange', handleHideAmountsChange);
        };
    }, [refetch]);

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

    if (isError || !comparison) {
        return (
            <div className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bgSecondary)]">
                <p className="text-[var(--text)]">Failed to load budget comparison data</p>
            </div>
        );
    }

    const pieData = {
        labels: comparison.comparisons.map((item) => item.moneySource),
        datasets: [
            {
                data: comparison.comparisons.map((item) => item.actual),
                backgroundColor: generateRandomColors(comparison.comparisons.length),
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
                        const percentage = ((Number(context.raw) / comparison.totalActual) * 100).toFixed(1);
                        return `${label}: ${formatCurrency(value, currencyType, hideAmount)} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-[var(--border-radius)] border border-[var(--border-color)] bg-[var(--bg)] shadow-md"
        >
            <h3 className="text-lg font-semibold text-[var(--text)] mb-4">Budget vs Actual</h3>

            <div className="flex flex-col lg:flex-row gap-6 items-center">
                <div className="w-full lg:w-1/2">
                    <div className="h-[300px] flex items-center justify-center">
                        <Pie data={pieData} options={pieOptions} />
                    </div>
                </div>

                <div className="w-full lg:w-1/2">
                    <ComparisonTable data={comparison.comparisons.map(item => ({
                        ...item,
                        budget: item.budget,
                        actual: item.actual,
                        variance: item.variance,
                    }))} 
                    currencyType={currencyType} 
                    hideAmount={hideAmount} />

                    <div className="mt-4 p-4 bg-[var(--bgSecondary)] rounded-[var(--border-radius)]">
                        <h4 className="font-semibold mb-2 text-[var(--text)]">Summary</h4>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-[var(--text)]/60">Total Budget</p>
                                <p className="font-bold">{formatCurrency(comparison.totalBudget, currencyType, hideAmount)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text)]/60">Total Actual</p>
                                <p className="font-bold">{formatCurrency(comparison.totalActual, currencyType, hideAmount)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[var(--text)]/60">Variance</p>
                                <p className="font-bold">{formatCurrency(comparison.totalVariance, currencyType, hideAmount)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}