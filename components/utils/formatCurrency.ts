import { Currency } from '@/app/exchange-rates/_requests';

interface CurrencyConfig {
  locale: string;
  currency: string;
  symbol: string;
}

// Static fallback currencies for when exchange rates are not available
const fallbackCurrencyConfigs: Record<string, CurrencyConfig> = {
  USD: {
    locale: 'en-US',
    currency: 'USD',
    symbol: '$'
  },
  ETB: {
    locale: 'am-ET',
    currency: 'ETB',
    symbol: 'Br'
  },
  EUR: {
    locale: 'de-DE',
    currency: 'EUR',
    symbol: '€'
  }
};

// Function to get currency config from dynamic currencies or fallback
const getCurrencyConfig = (currencyType: string, availableCurrencies?: Currency[]): CurrencyConfig => {
  // First try to get from available currencies (from API)
  if (availableCurrencies) {
    const currency = availableCurrencies.find(c => c.code === currencyType);
    if (currency) {
      return {
        locale: getLocaleForCurrency(currencyType),
        currency: currencyType,
        symbol: currency.symbol
      };
    }
  }
  
  // Fallback to static config
  return fallbackCurrencyConfigs[currencyType] || fallbackCurrencyConfigs.USD;
};

// Function to get appropriate locale for currency
const getLocaleForCurrency = (currencyCode: string): string => {
  const localeMap: Record<string, string> = {
    USD: 'en-US',
    EUR: 'de-DE',
    GBP: 'en-GB',
    JPY: 'ja-JP',
    CNY: 'zh-CN',
    INR: 'hi-IN',
    KRW: 'ko-KR',
    RUB: 'ru-RU',
    ETB: 'am-ET',
    // Add more as needed, fallback to en-US
  };
  
  return localeMap[currencyCode] || 'en-US';
};

export const formatCurrency = (
  value: number,
  currencyType: string = 'USD',
  hideAmount: boolean = false,
  hideDecimals: boolean = false,
  availableCurrencies?: Currency[]
): string => {
  if (hideAmount) {
    return '•••••';
  }

  const config = getCurrencyConfig(currencyType, availableCurrencies);

  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: hideDecimals ? 0 : 2,
      maximumFractionDigits: hideDecimals ? 0 : 2
    }).format(value);  } catch {
    // Fallback formatting if Intl fails
    return `${config.symbol}${value.toFixed(hideDecimals ? 0 : 2)}`;
  }
};

// New function specifically for compact formatting with dynamic currency support
export const formatCompactCurrency = (
  value: number, 
  currencyType: string, 
  hideAmount: boolean,
  availableCurrencies?: Currency[]
): string => {
  if (hideAmount) return '****';
  
  const absValue = Math.abs(value);
  
  // For values less than 1000, show normally
  if (absValue < 1000) {
    return formatCurrency(value, currencyType, false, true, availableCurrencies);
  }
  
  // For larger values, use compact notation
  const units = [
    { threshold: 1e9, suffix: 'B' },
    { threshold: 1e6, suffix: 'M' },
    { threshold: 1e3, suffix: 'K' }
  ];
  
  for (const unit of units) {
    if (absValue >= unit.threshold) {
      const compactValue = value / unit.threshold;
      const config = getCurrencyConfig(currencyType, availableCurrencies);
      return `${config.symbol}${compactValue.toFixed(1)}${unit.suffix}`;
    }
  }
  
  return formatCurrency(value, currencyType, false, true, availableCurrencies);
};