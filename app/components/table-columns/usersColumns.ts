import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";

import type { User } from "#shared/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DataTableColumnHeader,
  DataTableRowActions,
} from "@/components/data-table";

export const usersColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) =>
      h(Checkbox, {
        modelValue:
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate"),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          table.toggleAllPageRowsSelected(!!value),
        "aria-label": "Select all",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        "aria-label": "Select row",
      }),
    size: 28,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Name" }),
    cell: ({ row }) =>
      h(
        "div",
        { class: "max-w-[500px] truncate font-medium" },
        row.getValue("name"),
      ),
    enableHiding: true,
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Email" }),
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Status" }),
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return h(
        Badge,
        {
          variant: "outline",
          class: status === "Inactive" ? "bg-muted-foreground/10" : "",
        },
        () => status,
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "balance",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Balance" }),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("balance"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return h("div", { class: "font-medium" }, formatted);
    },
  },
  {
    id: "actions",
    cell: ({ row }: any) =>
      h(DataTableRowActions, { row, class: "text-right" }),
    enableHiding: false,
  },
];
