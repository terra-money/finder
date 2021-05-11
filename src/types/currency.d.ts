interface Currency {
  response: {
    data?: CurrencyData[];
    isLoading: boolean;
  };
  currency: string;
}

interface CurrencyData {
  denom: string;
  oneDayVariation: string;
  oneDayVariationRate: string;
  swaprate: string;
}
