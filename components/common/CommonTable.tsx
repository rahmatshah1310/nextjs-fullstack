// CommonTable.tsx
"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Icons } from "@/constants/icons";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
}

interface CustomTableProps<T> {
  columns: Column<T>[];
  data?: T[];
}

export function CustomTable<T extends { id: string | number }>({ columns, data = [] }: CustomTableProps<T>) {
  return (
    <div className="w-full overflow-x-auto">
      <Table className="w-full min-w-[600px]">
        <TableHeader>
          <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-transparent">
            {columns.map((col) => (
              <TableHead
                key={col.header}
                className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-50/50 dark:bg-gray-800/50 first:rounded-tl-lg last:rounded-tr-lg whitespace-nowrap"
              >
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="px-3 sm:px-6 py-8 sm:py-12 text-center text-gray-500 dark:text-gray-400">
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Icons.inbox className="w-6 h-6" />
                  </div>
                  <p className="text-base sm:text-lg font-medium">No data available</p>
                  <p className="text-sm">Start by adding some products to your catalog</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row.id}
                className={`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors duration-200 ${
                  index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50/30 dark:bg-gray-800/30"
                }`}
              >
                {columns.map((col) => (
                  <TableCell
                    key={col.header}
                    className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-700 dark:text-gray-300 whitespace-nowrap truncate overflow-hidden text-ellipsis min-w-[150px] max-w-[200px]"
                  >
                    {col.render ? col.render(row) : (row[col.accessor] as React.ReactNode)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
