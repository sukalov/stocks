'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from '../../node_modules/lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export type IndexName = 'kpop-25' | 'cosmetics-15' | 'anime-10' | 'consumer-50' | 'tech-100' |'entertainment-100' | 'video-75';

export type StockInfo = {
  name: string,
  symbol: string,
  country: string,
  currency: string,
  shares: number,
  cap_index: string,
  indicies: IndexName[],
  [otherOptions: string]: any
}

export const columns: ColumnDef<StockInfo>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <div className='w-[150px]'>
        <Button variant="ghost" className='text-xs' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="capitalize ml-4 w-[150px]">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'symbol',
    header: ({ column }) => {
      return (
        <div className=''>
        <Button variant="ghost" className='text-xs' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Symbol
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="capitalize ml-4 font-bold">{row.getValue('symbol')}</div>,
  },
  {
    accessorKey: 'country',
    header: ({ column }) => {
      return (
        <div className=''>
        <Button variant="ghost" className='text-xs' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Country
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="capitalize ml-4">{row.getValue('country')}</div>,
  },
  {
    accessorKey: 'shares',
    header: ({ column }) => {
      return (
        <Button variant="ghost" className='text-xs' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Shares
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const shares = parseFloat(row.getValue('shares'));
      const formatted = new Intl.NumberFormat().format(shares);
      
     return (
     <div className="ml-4 w-24">{formatted}</div>
     )
    }
  },
  {
    accessorKey: 'currency',
    header: ({ column }) => {
      return (
          <Button variant="ghost" className='text-xs' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Currency
            <ArrowUpDown className="ml-1 h-4 w-4" />
          </Button>
      );
    },
    cell: ({ row }) => {
      const currency = String(row.getValue('currency'));

      return <div className=" ml-4 w-14 px-0">{currency}</div>;
    },
  },
  {
    accessorKey: 'cap_index',
    header: ({ column }) => {
      return (
        <div className=" w-28">
        <Button variant="ghost" className='text-xs' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Cap Index
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
        </div>
      );
    },
    cell: ({ row }) => <div className="capitalize ml-4 w-24">{row.getValue('cap_index')}</div>,
  },
  {
    accessorKey: 'indicies',
    header: ({ column }) => {
      return (
        <div className="w-36">
        <Button variant="ghost" className='text-xs' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Indicies
          <ArrowUpDown className="ml-1 h-4 w-4" />
        </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      const indicies = row.getValue('indicies') as IndexName[]
      return (
        <div className="ml-4 w-36">
          {indicies ? indicies.join('\r\n') : null}
        </div>
      )
    }
  },
];

export function StocksInfoTable({ data }: {data: StockInfo[]}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="search for company name"
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
          className="max-w-full mr-8"
        />
        <Input
          placeholder="search for symbol"
          value={(table.getColumn('symbol')?.getFilterValue() as string) ?? ''}
          onChange={(event) => table.getColumn('symbol')?.setFilterValue(event.target.value)}
          className="max-w-full mr-8"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
