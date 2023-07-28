interface DataOnlySymbol {
  symbol: string;
  [otherOptions: string]: unknown;
}

interface DataSharesOutstanding extends d3.DSVRowString {
  symbol: string;
  shares: number;
  currency: 'TWD' | 'JPY' | 'USD' | 'KRW';
  [otherOptions: string]: unknown;
}

interface DataInitialPrices extends d3.DSVRowString {
  symbol: string;
  initial_price: number;
  currency: 'TWD' | 'JPY' | 'USD' | 'KRW';
  [otherOptions: string]: unknown;
}

interface ResponseFundamental {
  SharesStats: {
    SharesOutstanding: number;
  };
  General: {
    CurrencyCode: 'TWD' | 'JPY' | 'USD' | 'KRW';
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
  currency: 'TWD' | 'JPY' | 'USD' | 'KRW';
  initial_price: number;
  shares: number;
  initial_date: string;
  initial_MC?: number;
  initial_MC_USD: number;
  share: number;
  share_adj?: number;
  [otherOptions: string]: any;
}

interface DataShareAdjusted {
  symbol: string;
  currency: 'TWD' | 'JPY' | 'USD' | 'KRW';
  initial_price: number;
  shares: number;
  initial_date: string;
  initial_MC: number;
  initial_MC_USD: number;
  share: number;
  share_adj: number;
  [otherOptions: string]: any;
}

interface CurrenciesPrice {
  date: string;
  KRW: number;
  TWD: number;
  JPY: number;
}

interface IndexDay {
  date: string;
  index: number;
  share_price_usd;
  [otherOptions: string]: any;
}

interface DataTotal {
  date: string;
  index: number;
  price: number;
  index_adjusted: number;
  index_shares: string[];
  refactor: null | {
    new_index: number;
    new_price: number;
    shares_added: string[];
    shares_removed: string[];
  }
}