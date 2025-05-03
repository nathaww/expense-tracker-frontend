interface CurrencyConfig {
  locale: string;
  currency: string;
  symbol: string;
}

const currencyConfigs: Record<string, CurrencyConfig> = {
  USD: {
    locale: 'en-US',
    currency: 'USD',
    symbol: '$'
  },
  ETB: {
    locale: 'am-ET',
    currency: 'ETB',
    symbol: 'Br'
  }
};

export const formatCurrency = (
  value: number,
  currencyType: string = 'USD',
  hideAmount: boolean = false
): string => {
  if (hideAmount) {
    return '•••••';
  }

  const config = currencyConfigs[currencyType] || currencyConfigs.USD;
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: config.currency
  }).format(value);
};