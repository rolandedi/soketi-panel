import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import {
  Copy,
  PencilIcon,
  RotateCcw,
  TrashIcon,
  LucideEllipsis,
} from "lucide-vue-next";

import type { Application } from "#shared/types";
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
import { toast } from "vue-sonner";

interface ApplicationsTableOptions {
  handleEdit?: (application: Application) => void;
  handleRegenerate?: (application: Application) => void;
  handleDelete?: (application: Application) => void;
}

function copyValue(value: string, label: string) {
  void navigator.clipboard?.writeText(value);
  toast.success(`${label} copied`);
}

const rowActions = (row: Application, options?: ApplicationsTableOptions) => {
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
    h(DropdownMenuContent, { align: "end", class: "w-48" }, () => [
      h(DropdownMenuItem, { onClick: () => options?.handleEdit?.(row) }, () => [
        h(PencilIcon, { size: 16 }),
        "Edit",
      ]),
      h(
        DropdownMenuItem,
        { onClick: () => options?.handleRegenerate?.(row) },
        () => [h(RotateCcw, { size: 16 }), "Regenerate credentials"],
      ),
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

export const getApplicationsColumns = (
  options?: ApplicationsTableOptions,
): ColumnDef<Application>[] => {
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
        h(DataTableColumnHeader<Application, any>, { column, title: "Name" }),
      cell: ({ row }) =>
        h(
          "div",
          { class: "max-w-[280px] truncate font-medium" },
          row.getValue("name"),
        ),
      enableHiding: false,
    },
    {
      accessorKey: "key",
      header: ({ column }) =>
        h(DataTableColumnHeader<Application, any>, { column, title: "Key" }),
      cell: ({ row }) => {
        const key = row.getValue("key") as string;

        return h("div", { class: "flex items-center gap-2" }, [
          h(
            "span",
            {
              class:
                "max-w-[220px] truncate font-mono text-xs text-muted-foreground",
            },
            key,
          ),
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              class: "size-7 text-muted-foreground hover:text-foreground",
              onClick: () => copyValue(key, "Application key"),
            },
            () => h(Copy, { class: "size-3.5" }),
          ),
        ]);
      },
    },
    {
      accessorKey: "secret",
      header: ({ column }) =>
        h(DataTableColumnHeader<Application, any>, { column, title: "Secret" }),
      cell: ({ row }) => {
        const secret = row.getValue("secret") as string;

        return h("div", { class: "flex items-center gap-2" }, [
          h(
            "span",
            {
              class:
                "max-w-[220px] truncate font-mono text-xs text-muted-foreground",
            },
            `${secret.slice(0, 8)}...${secret.slice(-6)}`,
          ),
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              class: "size-7 text-muted-foreground hover:text-foreground",
              onClick: () => copyValue(secret, "Application secret"),
            },
            () => h(Copy, { class: "size-3.5" }),
          ),
        ]);
      },
    },
    {
      accessorKey: "enabled",
      header: ({ column }) =>
        h(DataTableColumnHeader<Application, any>, {
          column,
          title: "Status",
        }),
      cell: ({ row }) => {
        const enabled = row.getValue("enabled") as boolean;

        return h(
          Badge,
          {
            variant: "outline",
            class: enabled
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
              : "border-muted-foreground/20 bg-muted/50 text-muted-foreground",
          },
          () => (enabled ? "Enabled" : "Disabled"),
        );
      },
      filterFn: (row, id, value: string) => {
        const enabled = row.getValue(id) as boolean;
        if (value === "enabled") return enabled === true;
        if (value === "disabled") return enabled === false;
        return true;
      },
    },
    {
      accessorKey: "created_at",
      header: ({ column }) =>
        h(DataTableColumnHeader<Application, any>, {
          column,
          title: "Created",
        }),
      cell: ({ row }) =>
        h(
          "div",
          { class: "max-w-[200px] text-muted-foreground truncate" },
          formatDate(row.getValue("created_at")),
        ),
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) =>
        h(DataTableColumnHeader<Application, any>, {
          column,
          title: "Updated",
        }),
      cell: ({ row }) => {
        const updatedAt = row.getValue("updated_at") as string | null;

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
        h(
          "div",
          { class: "flex justify-end" },
          rowActions(row.original, options),
        ),
      enableHiding: false,
    },
  ];
};
