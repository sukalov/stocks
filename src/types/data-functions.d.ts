interface  DataOnlySymbol {
    symbol: string;
    [otherOptions: string]: unknown;
  };
  
  interface DataSharesOutstanding {
      symbol: string;
      shares: number;
      [otherOptions: string]: unknown;
  }

  interface ResponseFundamental {
    SharesStats: {
      SharesOutstanding: number
    }
  }
  

  // export default {
  //     DataOnlySymbol,
  //     DataSharesOutstanding,
  //     ResponseFundamental
  //   };