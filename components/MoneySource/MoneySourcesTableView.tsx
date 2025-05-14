"use client";

import React from 'react';
import { MoneySource } from '@/app/money-sources/_requests';
import { TableView } from '@/components/UI/TableView';
import { FaWallet, FaUniversity, FaCreditCard } from 'react-icons/fa';
import { formatCurrency } from '@/components/utils/formatCurrency';

interface TableViewProps {
  data: MoneySource[];
  isLoading: boolean;
  preferredCurrency: string;
  onSort: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onView?: (source: MoneySource) => void;
  onEdit?: (source: MoneySource) => void;
  onDelete?: (source: MoneySource) => void;
}

export const MoneySourcesTableView: React.FC<TableViewProps> = ({
  data,
  isLoading,
  preferredCurrency,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onEdit,
  onDelete,
}) => {
  const getIconComponent = (icon: string) => {
    const icons = {
      wallet: <FaWallet className="text-[var(--color-primary)]" />,
      bank: <FaUniversity className="text-[var(--color-primary)]" />,
      "credit-card": <FaCreditCard className="text-[var(--color-primary)]" />
    };
    return icons[icon as keyof typeof icons] || <FaCreditCard className="text-[var(--color-primary)]" />;
  };
  
  const columns = [
    {
      header: 'Name',
      key: 'name',
      sortable: true,
      render: (item: MoneySource) => (
        <div className="flex items-center space-x-2">
          <div className="flex-shrink-0">
            {getIconComponent(item.icon)}
          </div>
          <div className="flex flex-col">
            <span>{item.name}</span>
            {item.isDefault && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full inline-block mt-1">
                Default
              </span>
            )}
          </div>
        </div>
      )
    },
    {
      header: 'Balance',
      key: 'balance',
      sortable: true,
      render: (item: MoneySource) => (
        <div>
          <div className="font-medium">{formatCurrency(item.balance, item.currency)}</div>
          {item.currency !== preferredCurrency && (
            <div className="text-xs text-[var(--text-secondary)]">
              {formatCurrency(item.balanceInPreferredCurrency, preferredCurrency)}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Budget',
      key: 'budget',
      sortable: true,
      render: (item: MoneySource) => (
        <div>
          <div className="font-medium">{formatCurrency(item.budget, item.currency)}</div>
          {item.currency !== preferredCurrency && (
            <div className="text-xs text-[var(--text-secondary)]">
              {formatCurrency(item.budgetInPreferredCurrency, preferredCurrency)}
            </div>
          )}
        </div>
      )
    },
    {
      header: 'Currency',
      key: 'currency',
      sortable: true
    },
    {
      header: 'Updated',
      key: 'updatedAt',
      sortable: true,
      render: (item: MoneySource) => new Date(item.updatedAt).toLocaleDateString()
    }
  ];

  return (
    <TableView
      data={data}
      columns={columns}
      sortBy={sortBy}
      sortOrder={sortOrder}
      onSort={onSort}
      keyExtractor={(item) => item.id}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      isLoading={isLoading}
      emptyMessage="No money sources found. Use the button above to create one."
    />
  );
};
