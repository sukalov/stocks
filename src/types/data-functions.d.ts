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

interface StocksInfo {
  id: number;
  symbol: string;
  name: string;
  currency: 'TWD' | 'JPY' | 'USD' | 'KRW';
  country: 'Japan' | 'Taiwan' | 'South Korea';
  shares: number;
  market_cap: number;
  cap_index: 'Blue Chip' | 'Mid/Small Cap' | null;
  indicies: Array<string>;
  is_delisted: boolean;
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

interface ResponseDividents {
  date: string;
  value: string;
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

interface DataDividents {
  [date: string]: {
    [symbol: string]: number;
  };
}

interface DividentsDB {
  date: Date;
  dividents: {
    [ticker: string]: number;
  };
}

interface CurrenciesPrice {
  date: Date | string;
  KRW: number;
  TWD: number;
  JPY: number;
}

interface IndexDay {
  date: string;
  name: string | undefined;
  adjustment: string | undefined;
  index: number | undefined;
  total_return: number | undefined;
  [otherOptions: string]: any;
}

interface DataTotal {
  date: string;
  index: number | null;
  price: number;
  index_adjusted: number | null;
  index_shares: string[];
  refactor: null | {
    new_index: number;
    new_price: number;
    shares_added: string[];
    shares_removed: string[];
  };
}

interface DataPrices {
  date: string;
  [symbol: string]: number;
}

interface DataAdjustments {
  id: number;
  date: Date;
  index: string;
  capitalizations: { [symbol: string]: number };
  original_percents: { [symbol: string]: number };
  percents: { [symbol: string]: number };
  is_quartile: boolean;
}
