interface DataOnlySymbol {
  symbol: string;
  [otherOptions: string]: unknown;
}

interface DataSharesOutstanding extends d3.DSVRowString {
  symbol: string;
  shares: number;
  [otherOptions: string]: unknown;
}

interface DataInitialPrices extends d3.DSVRowString {
  symbol: string;
  initial_price: number;
  [otherOptions: string]: unknown;
}

interface ResponseFundamental {
  SharesStats: {
    SharesOutstanding: number;
  };
}

interface ResponseHistorical {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  adjusted_close: number;
  volume: number;
}

interface DataSharesInitialDay {
  symbol: string;
  initial_price: number;
  shares: number;
  initial_date: string;
  initial_MC: number
  initial_MC_USD: number;
  share: number;
  share_adj: number;
  country: 'Japan' | 'South Korea' | 'Taiwan';
  [otherOptions: string]: any;
}
