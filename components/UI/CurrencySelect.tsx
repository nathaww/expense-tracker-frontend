"use client";

import React, { useState, useMemo } from 'react';
import * as Select from '@radix-ui/react-select';
import { FaChevronDown, FaChevronUp, FaCheck } from 'react-icons/fa';
import { Currency } from '@/app/exchange-rates/_requests';

interface CurrencySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  currencies: Currency[];
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  label?: string;
  error?: string;
  searchable?: boolean;
}

export const CurrencySelect: React.FC<CurrencySelectProps> = ({
  value,
  onValueChange,
  currencies,
  placeholder = "Select a currency",
  isLoading = false,
  disabled = false,
  className = "",
  label,
  error,
  searchable = true
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Filter currencies based on search term
  const filteredCurrencies = useMemo(() => {
    if (!searchTerm || !searchable) return currencies;
    
    const term = searchTerm.toLowerCase();
    return currencies.filter(currency => 
      currency.code.toLowerCase().includes(term) ||
      currency.name.toLowerCase().includes(term) ||
      currency.symbol.toLowerCase().includes(term)
    );
  }, [currencies, searchTerm, searchable]);

  // Get the selected currency for display
  const selectedCurrency = currencies.find(currency => currency.code === value);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleValueChange = (newValue: string) => {
    onValueChange(newValue);
    setSearchTerm("");
    setIsOpen(false);
  };

  if (isLoading) {
    return (
      <div className={`${className}`}>
        {label && (
          <label className="block text-[var(--text)] mb-2 text-sm font-medium">
            {label}
          </label>
        )}
        <div className="input w-full animate-pulse bg-[var(--bgSecondary)] h-12 rounded-[var(--border-radius)]"></div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-[var(--text)] mb-2 text-sm font-medium">
          {label}
        </label>
      )}
      
      <Select.Root 
        value={value} 
        onValueChange={handleValueChange}
        open={isOpen}
        onOpenChange={setIsOpen}
        disabled={disabled}
      >
        <Select.Trigger className="input w-full flex items-center justify-between cursor-pointer hover:bg-[var(--bgSecondary)] transition-colors">
          <Select.Value placeholder={placeholder}>
            {selectedCurrency ? (
              <div className="flex items-center gap-2">
                <span className="font-medium text-[var(--color-primary)]">
                  {selectedCurrency.code}
                </span>
                <span className="text-[var(--text-secondary)]">
                  {selectedCurrency.symbol}
                </span>
                <span className="text-[var(--text)] text-sm">
                  {selectedCurrency.name}
                </span>
              </div>
            ) : (
              placeholder
            )}
          </Select.Value>
          <Select.Icon className="text-[var(--text-secondary)]">
            <FaChevronDown size={12} />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="bg-[var(--bg)] border border-[var(--border-color)] rounded-[var(--border-radius)] shadow-xl z-50 max-h-80 overflow-hidden">
            <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-[var(--bg)] text-[var(--text)] cursor-default">
              <FaChevronUp size={12} />
            </Select.ScrollUpButton>
            
            <Select.Viewport className="p-1">
              {searchable && (
                <div className="p-2 border-b border-[var(--border-color)]">
                  <input
                    type="text"
                    placeholder="Search currencies..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full px-3 py-2 text-sm bg-[var(--bgSecondary)] border border-[var(--border-color)] rounded-md text-[var(--text)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              )}
              
              {filteredCurrencies.length === 0 ? (
                <div className="p-3 text-center text-[var(--text-secondary)] text-sm">
                  {searchTerm ? `No currencies found for "${searchTerm}"` : "No currencies available"}
                </div>
              ) : (
                filteredCurrencies.map((currency) => (
                  <Select.Item
                    key={currency.code}
                    value={currency.code}
                    className="relative flex items-center px-3 py-2 text-sm text-[var(--text)] cursor-pointer hover:bg-[var(--bgSecondary)] focus:bg-[var(--bgSecondary)] focus:outline-none rounded-md data-[highlighted]:bg-[var(--bgSecondary)] data-[highlighted]:text-[var(--text)]"
                  >
                    <Select.ItemText className="flex items-center gap-3 flex-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="font-medium text-[var(--color-primary)]">
                          {currency.code}
                        </span>
                        <span className="text-[var(--text-secondary)] flex-shrink-0">
                          {currency.symbol}
                        </span>
                        <span className="text-[var(--text)] text-sm truncate">
                          {currency.name}
                        </span>
                      </div>
                    </Select.ItemText>
                    <Select.ItemIndicator className="ml-2 text-[var(--color-primary)]">
                      <FaCheck size={12} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))
              )}
            </Select.Viewport>
            
            <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-[var(--bg)] text-[var(--text)] cursor-default">
              <FaChevronDown size={12} />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>
      
      {error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
};
