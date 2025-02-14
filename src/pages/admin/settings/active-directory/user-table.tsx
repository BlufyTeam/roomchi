import { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/shadcn/table";
import Button from "~/ui/buttons";

// Define the user type
interface User {
  id: string;
  displayName: string;
  sAMAccountName: string;
  mail: string;
}

// Define table columns
const columns = [
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

// Sample data

export default function UsersTable({ users }) {
  return (
    <Table className="text-center">
      <TableHeader className="text-center">
        <TableRow className="text-center">
          {columns.map((column) => (
            <TableHead className="text-center" key={column.accessorKey}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        {users.map((user) => (
          <TableRow className="text-center" key={user.mail}>
            <TableCell className="text-center">{user.displayName}</TableCell>
            <TableCell className="text-center">{user.sAMAccountName}</TableCell>
            <TableCell className="text-center">{user.mail}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
