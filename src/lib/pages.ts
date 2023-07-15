export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const pages: Item[] = [
  {
    name: "Stocks Info",
    slug: "stocks-info",
    description: "Detailed information about stocks used inindicies",
  },
  {
    name: "Market Data",
    slug: "market-data",
    description: "Information about stocks' daily prices",
  },
];
