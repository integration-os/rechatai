"use client";
import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  FilterFn,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  Header,
  ColumnDef,
  Cell,
  CellContext,
  flexRender,
  Row,
} from "@tanstack/react-table";
import { rankItem, compareItems } from "@tanstack/match-sorter-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, EyeIcon, LucideMessageSquareWarning, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "./skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { listUnifiedData } from "../../lib/frontend-api-helpers/unified";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  const itemRank = rankItem(String(row?.getValue?.(columnId)).toLowerCase(), String(value).toLowerCase());
  addMeta({ itemRank });
  return itemRank.passed;
};

export type FilterConfig = {
  id: string;
  label: string;
  filterFn: FilterFn<any>;
  type: "text" | "dropdown";
  options?: { value: string; label: string }[];
};

interface AdvancedTableProps<T = any> {
  model: string;
  connectionKey: string;
  onRowClick?: (row: T) => void;
  additionalColumns?: Array<{
    header: string;
    cell: (row: T) => React.ReactNode;
  }>;
  visibleFields?: string[];
  filterConfigs?: FilterConfig[];
  onFilterChange?: (filters: ColumnFiltersState) => void;
  refreshTrigger?: number;
  queryParams?: Record<string, string>;
}

interface APIResponse {
  unified: Record<string, any> | Record<string, any>[];
  pagination: {
    nextCursor: string | null;
    previousCursor: string | null;
    pageSize: number;
  };
}

const ExpandableCell: React.FC<{ value: any }> = ({ value }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isExpandable =
    (typeof value === "object" || Array.isArray(value)) && value !== null;

  const renderValue = (val: any): React.ReactNode => {
    if (Array.isArray(val)) {
      return (
        <Table>
          <TableBody>
            {val.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{renderValue(item)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    } else if (typeof val === "object" && val !== null) {
      return (
        <Table>
          <TableHeader className="border-b-1">
            <TableRow className="font-bold">
              <TableCell>Key</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(val).map(([key, v]) => (
              <TableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{renderValue(v)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    } else {
      return String(val);
    }
  };

  return (
    <>
      {isExpandable ? (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <EyeIcon className="h-4 w-4 mr-2" />
              View
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[60vw] max-h-[80vh] overflow-auto">
            <DialogHeader className="p-4">
              <DialogTitle>
                Expanded {Array.isArray(value) ? "Array" : "Object"}
              </DialogTitle>
            </DialogHeader>
            {renderValue(value)}
          </DialogContent>
        </Dialog>
      ) : (
        String(value)
      )}
    </>
  );
};

const AdvancedTable: React.FC<AdvancedTableProps> = ({
  model,
  connectionKey,
  onRowClick,
  additionalColumns,
  visibleFields: displayFields = [],
  filterConfigs = [],
  onFilterChange,
  refreshTrigger = 0,
  queryParams = {},
}) => {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pageSize, setPageSize] = useState(20);
  const [cursor, setCursor] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);
  const [cursorStack, setCursorStack] = useState<string[]>([]);
  const [searchableColumns, setSearchableColumns] = useState<string[]>([]);

  const { data, error, isLoading, isFetching, refetch } = useQuery<APIResponse>(
    {
      queryKey: ["tableData", connectionKey, model, pageSize, cursor, refreshTrigger, cursorStack.length, queryParams],
      queryFn: () =>
        listUnifiedData({
          model,
          connectionKey,
          cursor: cursor || undefined,
          ...queryParams,
        }),
      retry: 2,
    }
  );

  React.useEffect(() => {
    refetch();
  }, [refreshTrigger]);

  const processedData = useMemo(() => {
    if (!data || !data.unified) return [];
    if (Array.isArray(data.unified)) {
      return data.unified;
    } else {
      return Object.values(data.unified);
    }
  }, [data]);

  const columns = useMemo(() => {
    if (processedData.length === 0) return [];
    const firstItem = processedData[0];

    const commonFields = [
      "id",
      "firstName",
      "lastName",
      "name",
      "email",
      "defaultEmail",
      "phone",
      "defaultPhone",
      "title",
      "status",
      "total",
      "amount",
      "currency",
      // "createdAt",
      // "updatedAt",
    ];

    const allFields = Object.keys(firstItem);
    const defaultVisibleFields =
      displayFields.length > 0
        ? displayFields
        : allFields.filter((key) => commonFields.includes(key));

    // Add additional column headers to visibleColumns
    const additionalColumnHeaders = additionalColumns?.map(col => col.header) || [];
    const allVisibleFields = [...defaultVisibleFields, ...additionalColumnHeaders];

    // Initialize visibleColumns if it's empty
    if (visibleColumns.length === 0) {
      const newVisibleColumns = allVisibleFields;
      setVisibleColumns(newVisibleColumns);
      // Set searchableColumns to be the same as visibleColumns by default
      setSearchableColumns(newVisibleColumns);
    }

    const baseColumns = allFields.map((key) => ({
      id: key,
      accessorKey: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      cell: (info: CellContext<Record<string, any>, any>) => {
        try {
          const value = info.getValue ? info.getValue() : info.row.original[key];
          return <ExpandableCell value={value} />;
        } catch (error) {
          console.error(`Error rendering cell for key ${key}:`, error);
          return <span className="text-red-500">Error</span>;
        }
      },
    })) as ColumnDef<Record<string, any>>[];

    const extraColumns = additionalColumns?.map((col) => ({
      id: col.header,
      header: col.header,
      cell: ({ row }: { row: Row<Record<string, any>> }) => {
        if (typeof col.cell === 'function') {
          return col.cell(row.original);
        }
        return null;
      },
    })) as ColumnDef<Record<string, any>>[] || [];

    return [...baseColumns, ...extraColumns];
  }, [processedData, additionalColumns, displayFields, visibleColumns]);

  const table = useReactTable({
    data: processedData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: (filters) => {
      const newFilters = typeof filters === 'function' ? filters(columnFilters) : filters;
      setColumnFilters(newFilters);
      onFilterChange?.(newFilters);
    },
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      if (searchableColumns.length === 0) return true;
      const searchableValues = searchableColumns.map(colId => String(row.getValue(colId)).toLowerCase());
      return searchableValues.some(value => value.includes(String(filterValue).toLowerCase()));
    },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleNextPage = () => {
    if (data?.pagination.nextCursor) {
      setCursorStack((prev) => [...prev, cursor || '']);
      setCursor(data.pagination.nextCursor);
    }
  };

  const handlePreviousPage = () => {
    if (cursorStack.length > 0) {
      const previousCursor = cursorStack[cursorStack.length - 1];
      setCursor(previousCursor);
      setCursorStack((prev) => prev.slice(0, -1));
    }
  };

  const renderHeader = (header: Header<Record<string, any>, unknown>) => {
    return (
      <TableHead key={header.id}>
        {header.isPlaceholder ? null : (
          <div className="flex items-center gap-2">
            <div className="text-foreground">
              {header.column.columnDef.header as React.ReactNode}
            </div>
            {/* {header.column.getCanFilter() && (
              <Input
                value={(header.column.getFilterValue() as string) ?? ""}
                onChange={(e) => header.column.setFilterValue(e.target.value)}
                placeholder={`Filter ${header.column.columnDef.header as string}`}
                className="max-w-40 h-6 text-xs border-none bg-muted"
              />
            )} */}
          </div>
        )}
      </TableHead>
    );
  };

  const renderCell = (cell: Cell<Record<string, any>, unknown>) => {
    if (typeof cell.column.columnDef.cell === "function") {
      return cell.column.columnDef.cell(cell as any);
    }
    return <ExpandableCell value={cell?.getValue?.()} />;
  };

  const renderFilters = () => {
    if (filterConfigs.length === 0) return null;

    const renderFilterInput = (config: FilterConfig) => (
      config.type === "text" ? (
        <Input
          id={config.id}
          value={(table.getColumn(config.id)?.getFilterValue() as string) ?? ""}
          onChange={(e) => table.getColumn(config.id)?.setFilterValue(e.target.value)}
          placeholder={`Filter ${config.label}`}
          className="w-full"
        />
      ) : (
        <Select
          value={(table.getColumn(config.id)?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => table.getColumn(config.id)?.setFilterValue(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${config.label}`} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {config.options?.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    );

    if (filterConfigs.length <= 2) {
      return filterConfigs.map((config) => (
        <div key={config.id} className="w-40">
          {renderFilterInput(config)}
        </div>
      ));
    }

    return (
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="text-sm font-medium mb-4">Filters</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filterConfigs.map((config) => (
              <div key={config.id} className="space-y-2">
                <label htmlFor={config.id} className="text-sm font-medium text-muted-foreground">
                  {config.label}
                </label>
                {renderFilterInput(config)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading)
    return (
      <div className="w-full">
        <div className="flex items-center justify-between py-4">
          <Skeleton className="h-10 w-[250px]" />
          <Skeleton className="h-10 w-[100px]" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {[...Array(5)].map((_, index) => (
                  <TableHead key={index}>
                    <Skeleton className="h-6 w-full" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(7)].map((_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {[...Array(5)].map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Skeleton className="h-10 w-[100px]" />
          <Skeleton className="h-10 w-[70px]" />
        </div>
      </div>
    );
  if (error)
    return (
      <Card className="w-full  mx-auto mt-4">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center">
            <LucideMessageSquareWarning className="w-6 h-6 mr-2" />
            Error
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <p className="text-sm text-gray-600">An error occurred:</p>
          <p className="font-medium">{(error as Error).message}</p>
          <code className="text-xs p-2 bg-muted rounded-md">
            {JSON.stringify(error, null, 2)}
          </code>
        </CardContent>
      </Card>
    );

  return (
    <div>
      {/* {filterConfigs.length > 2 && renderFilters()} */}
      <div className="flex items-center py-4">
        {/* Hiding the search for now */}
        {/* <Input
          placeholder="Search all columns..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        /> */}
        <div className="ml-auto flex items-center space-x-2">
          {/* {filterConfigs.length <= 2 && renderFilters()} */}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
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
                      checked={visibleColumns.includes(column.id)}
                      onCheckedChange={(value) => {
                        setVisibleColumns((prev) => {
                          const newVisibleColumns = value
                            ? [...prev, column.id]
                            : prev.filter((id) => id !== column.id);
                          // Update searchableColumns when visibleColumns change
                          setSearchableColumns(newVisibleColumns);
                          return newVisibleColumns;
                        });
                        column.toggleVisibility(!!value);
                      }}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers
                  .filter((header) => visibleColumns.includes(header.id))
                  .map(renderHeader)}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => onRowClick?.(row.original)}
                  className={onRowClick ? "cursor-pointer" : ""}
                >
                  {row
                    .getVisibleCells()
                    .filter((cell) => visibleColumns.includes(cell.column.id))
                    .map((cell) => (
                      <TableCell key={cell.id}>{renderCell(cell)}</TableCell>
                    ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousPage}
          disabled={cursorStack.length === 0 || isFetching}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={!data?.pagination?.nextCursor || isFetching}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default AdvancedTable;