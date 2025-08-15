// CommonTable.tsx
"use client";

import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
    <Table className="border ">
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.header} className="border rounded">
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.header} className="border rounded">
                {col.render ? col.render(row) : (row[col.accessor] as React.ReactNode)}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
