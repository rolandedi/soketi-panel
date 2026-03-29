import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { Copy, EyeIcon, LucideEllipsis, TrashIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

import type { Message } from "#shared/types";
import { formatDate } from "#shared/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/data-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessagesTableOptions {
  handleViewPayload?: (message: Message) => void;
  handleDelete?: (message: Message) => void;
}

function copyValue(value: string, label: string) {
  void navigator.clipboard?.writeText(value);
  toast.success(`${label} copied`);
}

const rowActions = (row: Message, options: MessagesTableOptions) => {
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
    h(DropdownMenuContent, { align: "end", class: "w-44" }, () => [
      h(
        DropdownMenuItem,
        { onClick: () => options.handleViewPayload?.(row) },
        () => [h(EyeIcon, { size: 16 }), "View payload"],
      ),
      h(
        DropdownMenuItem,
        {
          class: "text-destructive focus:text-destructive",
          onClick: () => options.handleDelete?.(row),
        },
        () => [h(TrashIcon, { size: 16 }), "Delete"],
      ),
    ]),
  ]);
};

export const getMessagesColumns = (
  options?: MessagesTableOptions,
): ColumnDef<Message>[] => {
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
      accessorKey: "id",
      header: ({ column }) =>
        h(DataTableColumnHeader<Message, any>, { column, title: "ID" }),
      cell: ({ row }) => {
        const id = row.getValue("id") as string;

        return h("div", { class: "flex items-center gap-2" }, [
          h(
            "span",
            {
              class:
                "max-w-[220px] truncate font-mono text-xs text-muted-foreground",
            },
            id,
          ),
          h(
            Button,
            {
              variant: "ghost",
              size: "icon",
              class: "size-7 text-muted-foreground hover:text-foreground",
              onClick: () => copyValue(id, "Message ID"),
            },
            () => h(Copy, { class: "size-3.5" }),
          ),
        ]);
      },
      enableHiding: false,
    },
    {
      accessorKey: "channel",
      header: ({ column }) =>
        h(DataTableColumnHeader<Message, any>, { column, title: "Channel" }),
      cell: ({ row }) =>
        h(
          "div",
          { class: "max-w-[260px] truncate font-medium" },
          row.getValue("channel"),
        ),
      enableHiding: false,
    },
    {
      accessorKey: "event",
      header: ({ column }) =>
        h(DataTableColumnHeader<Message, any>, { column, title: "Event" }),
      cell: ({ row }) => {
        const event = row.getValue("event") as string;

        return h(
          Badge,
          {
            variant: "outline",
            class:
              "max-w-[240px] truncate border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
          },
          () => event,
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) =>
        h(DataTableColumnHeader<Message, any>, { column, title: "Created" }),
      cell: ({ row }) =>
        h(
          "div",
          { class: "max-w-[220px] truncate text-muted-foreground" },
          formatDate(row.getValue("created_at")),
        ),
      enableHiding: false,
    },
    {
      id: "actions",
      cell: ({ row }) =>
        h("div", { class: "flex justify-end gap-2" }, [
          rowActions(row.original, options ?? {}),
        ]),
      enableHiding: false,
    },
  ];
};
