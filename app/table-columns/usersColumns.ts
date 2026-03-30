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

interface UsersTableOptions {
  handleEdit?: (user: User) => void;
  handleBan?: (user: User) => void;
  handleDelete?: (user: User) => void;
}

const rowActions = (row: User, options?: UsersTableOptions) => {
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
      h(DropdownMenuItem, { onClick: () => options?.handleEdit?.(row) }, () => [
        h(PencilIcon, { size: 16 }),
        "Edit",
      ]),
      h(DropdownMenuItem, { onClick: () => options?.handleBan?.(row) }, () => [
        h(BanIcon, { size: 16 }),
        row.banned ? "Unban" : "Ban",
      ]),
      h(DropdownMenuSeparator),
      h(
        DropdownMenuItem,
        {
          class: "text-destructive focus:text-destructive",
          onClick: () => options?.handleDelete?.(row),
        },
        () => [h(TrashIcon, { size: 16 }), "Delete"],
      ),
    ]),
  ]);
};

export const getUsersColumns = (
  options?: UsersTableOptions,
): ColumnDef<User>[] => {
  return [
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
      enableHiding: false,
    },
    {
      accessorKey: "email",
      header: ({ column }) =>
        h(DataTableColumnHeader<User, any>, { column, title: "Email" }),
      enableHiding: false,
    },
    {
      accessorKey: "role",
      header: ({ column }) =>
        h(DataTableColumnHeader<User, any>, { column, title: "Role" }),
      filterFn: (row, id, value: string) => value === row.getValue(id),
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
      enableHiding: false,
    },
    {
      accessorKey: "status",
      accessorFn: (row) => row.emailVerified,
      header: ({ column }) =>
        h(DataTableColumnHeader<User, any>, { column, title: "Status" }),
      cell: ({ row }) => {
        const status = row.getValue("status") as boolean;
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
      filterFn: (row, id, value: string) => {
        const emailVerified = row.getValue(id) as boolean;
        if (value === "verified") return emailVerified === true;
        if (value === "unverified") return emailVerified === false;
        return true;
      },
    },
    {
      accessorKey: "banned",
      header: ({ column }) =>
        h(DataTableColumnHeader<User, any>, { column, title: "Banned" }),
      filterFn: (row, id, value: string) => {
        const banned = row.getValue(id) as boolean;
        if (value === "banned") return banned === true;
        if (value === "not-banned") return banned === false;
        return true;
      },
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
      accessorKey: "banReason",
      header: ({ column }) =>
        h(DataTableColumnHeader<User, any>, { column, title: "Ban Reason" }),
      cell: ({ row }) => {
        const banReason = row.getValue("banReason") as string | null;
        return h(
          "div",
          { class: "max-w-[300px] text-muted-foreground truncate" },
          banReason || "-",
        );
      },
      enableHiding: true,
      enableSorting: false,
    },
    {
      accessorKey: "banExpires",
      header: ({ column }) =>
        h(DataTableColumnHeader<User, any>, {
          column,
          title: "Ban Expires At",
        }),
      cell: ({ row }) => {
        const banExpires = row.getValue("banExpires") as string;
        return h(
          "div",
          { class: "max-w-[200px] text-muted-foreground truncate" },
          banExpires ? formatDate(banExpires) : "-",
        );
      },
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) =>
        h(DataTableColumnHeader<User, any>, { column, title: "Created At" }),
      filterFn: (row, id, value: string) => {
        const createdAt = new Date(row.getValue(id) as string);
        const now = new Date();
        const diffDays =
          (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
        if (value === "7d") return diffDays <= 7;
        if (value === "30d") return diffDays <= 30;
        if (value === "3m") return diffDays <= 90;
        if (value === "6m") return diffDays <= 180;
        if (value === "1y") return diffDays <= 365;
        return true;
      },
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as string;
        return h(
          "div",
          { class: "max-w-[200px] text-muted-foreground truncate" },
          formatDate(createdAt),
        );
      },
      enableHiding: false,
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
      cell: ({ row }) => {
        return h(
          "div",
          { class: "text-right" },
          rowActions(row.original, options),
        );
      },
      enableHiding: false,
    },
  ];
};
