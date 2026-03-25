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
        ariaLabel: "Select all",
        class: "translate-y-0.5",
      }),
    cell: ({ row }) =>
      h(Checkbox, {
        modelValue: row.getIsSelected(),
        "onUpdate:modelValue": (value: boolean | "indeterminate") =>
          row.toggleSelected(!!value),
        ariaLabel: "Select row",
        class: "translate-y-0.5",
      }),
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
  },
  {
    accessorKey: "email",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Email" }),
  },
  {
    accessorKey: "location",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Location" }),
    cell: ({ row }) =>
      h("div", { class: "flex items-center" }, [
        h("span", { class: "mr-2 text-lg" }, row.original.flag),
        h("span", {}, row.getValue("location")),
      ]),
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
    cell: ({ row }) => h(DataTableRowActions, { row }),
  },
];
