"use client";

import { useEffect, useState } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/shadcn/table";
import { Checkbox } from "~/components/shadcn/checkbox";

// Define the user type
export type AcUser = {
  id: string;
  displayName: string;
  sAMAccountName: string;
  mail: string;
};

export default function UsersTable({
  users,
  onSelectionChange,
}: {
  users: any;
  onSelectionChange?: (selectedUsers: AcUser[]) => void;
}) {
  const [rowSelection, setRowSelection] = useState({});

  // Get the selected users based on the rowSelection state
  const getSelectedUsers = () => {
    return Object.keys(rowSelection).map(
      (rowIndex) => users[Number.parseInt(rowIndex)]
    );
  };

  // Call the onSelectionChange callback when selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(getSelectedUsers());
    }
  }, [rowSelection]); // Removed unnecessary dependency:
  // Define table columns with selection column
  const columns: ColumnDef<AcUser>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() ? "indeterminate" : false)
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="mx-auto"
        />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "displayName",
      header: "Display Name",
    },
    {
      accessorKey: "sAMAccountName",
      header: "Username",
    },
    {
      accessorKey: "mail",
      header: "Email",
    },
  ];

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div>
      <div className="mb-4">
        {Object.keys(rowSelection).length > 0 && (
          <div className="text-muted-foreground text-sm">
            {Object.keys(rowSelection).length} row(s) selected
          </div>
        )}
      </div>
      <Table className="text-center">
        <TableHeader className="text-center">
          <TableRow className="text-center">
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <TableHead className="text-center" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))
            )}
          </TableRow>
        </TableHeader>
        <TableBody className="text-center">
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="text-center"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
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
  );
}
