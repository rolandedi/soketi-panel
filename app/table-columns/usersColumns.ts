import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import {
  BanIcon,
  LucideEllipsis,
  PencilIcon,
  TrashIcon,
} from "lucide-vue-next";

import type { User } from "#shared/types";
import { formatDate } from "#shared/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "@/components/data-table";

const rowActions = (row: User) => {
  return h(DropdownMenu, () => [
    h(DropdownMenuTrigger, { asChild: true }, () =>
      h(
        Button,
        {
          variant: "outline",
          class: "inline-flex size-8 p-0 data-[state=open]:bg-accent",
        },
        () => [
          h(LucideEllipsis, { size: 16 }),
          h("span", { class: "sr-only" }, "Open actions"),
        ],
      ),
    ),
    h(DropdownMenuContent, { align: "end", class: "w-40" }, () => [
      h(DropdownMenuItem, () => [h(PencilIcon, { size: 16 }), "Edit"]),
      h(DropdownMenuItem, () => [h(BanIcon, { size: 16 }), "Ban"]),
      h(DropdownMenuSeparator),
      h(DropdownMenuItem, () => [h(TrashIcon, { size: 16 }), "Delete"]),
    ]),
  ]);
};

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
    accessorKey: "role",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Role" }),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return h(
        Badge,
        {
          variant: "outline",
          class:
            role === "admin"
              ? "bg-muted-foreground text-white"
              : "bg-muted-foreground/10",
        },
        () => (role === "admin" ? "Admin" : "User"),
      );
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Status" }),
    cell: ({ row }) => {
      const status = row.original.emailVerified;
      return h(
        Badge,
        {
          variant: "outline",
          class: status
            ? "bg-green-500 text-white border-0"
            : "bg-yellow-500 text-white border-0",
        },
        () => (status ? "Verified" : "Unverified"),
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "banned",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Banned" }),
    cell: ({ row }) => {
      const banned = row.getValue("banned") as boolean;
      return h(
        Badge,
        {
          variant: "outline",
          class: banned
            ? "bg-muted-foreground text-white"
            : "bg-muted-foreground/10",
        },
        () => (banned ? "Banned" : "Not banned"),
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Created At" }),
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      return h(
        "div",
        { class: "max-w-[200px] text-muted-foreground truncate" },
        formatDate(createdAt),
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) =>
      h(DataTableColumnHeader<User, any>, { column, title: "Updated At" }),
    cell: ({ row }) => {
      const updatedAt = row.getValue("updatedAt") as string | null;
      return h(
        "div",
        { class: "max-w-[200px] text-muted-foreground truncate" },
        updatedAt ? formatDate(updatedAt) : "-",
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) =>
      h("div", { class: "text-right" }, rowActions(row.original)),
    enableHiding: false,
  },
];
