export type Item = {
  name: string;
  slug: string;
  description?: string;
};

export const pages: Item[] = [
  {
    name: 'Stocks Info',
    slug: 'stocks-info',
    description: 'Detailed information about stocks used inindicies',
  },
  {
    name: 'Indicies',
    slug: 'indicies',
    description: 'Testing line chart for kpop-25 index',
  },
];
