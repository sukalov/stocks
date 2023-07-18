interface  DataOnlySymbol {
    symbol: string;
    [otherOptions: string]: unknown;
  };
  
  interface DataSharesOutstanding {
      symbol: string;
      shares: number;
      [otherOptions: string]: unknown;
  }

  interface DataInitialPrices {
      symbol: string;
      initial_price: number;
      [otherOptions: string]: unknown;
  }

  interface ResponseFundamental {
    SharesStats: {
      SharesOutstanding: number
    }
  }

  interface ResponseHistorical {
    date: string,
    open: number,
    high: number,
    low: number,
    close: number,
    adjusted_close: number,
    volume: number
  }
