import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Column {
  Header: string;
  accessor: string;
  headerClassName?: string;
  cellClassName?: string;
}

interface Footer {
  colSpan: number;
  content: React.ReactNode;
  className?: string;
}

interface DataTableProps {
  columns: Column[];
  data: Record<string, any>[];
  caption?: string;
  footer?: Footer[];
}

export const GenericTable: React.FC<DataTableProps> = ({ columns, data, caption, footer }) => {
  return (
    <Table>
      {caption && <TableCaption>{caption}</TableCaption>}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessor} className={column.headerClassName}>
              {column.Header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {columns.map((column) => (
              <TableCell key={column.accessor} className={column.cellClassName}>
                {row[column.accessor]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      {footer && (
        <TableFooter>
          <TableRow>
            {footer.map((foot, index) => (
              <TableCell key={index} colSpan={foot.colSpan} className={foot.className}>
                {foot.content}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      )}
    </Table>
  );
};
