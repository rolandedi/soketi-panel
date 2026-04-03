import { h } from "vue";
import type { ColumnDef } from "@tanstack/vue-table";
import { Copy, EyeIcon, LucideEllipsis, TrashIcon, ArrowUpRight, Users, Webhook } from "lucide-vue-next";
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

function getSourceBadge(source: string) {
  const sourceConfig: Record<string, { label: string; class: string; icon: any }> = {
    backend_api: {
      label: "Backend API",
      class: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
      icon: ArrowUpRight,
    },
    client_webhook: {
      label: "Client Event",
      class: "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-300",
      icon: Webhook,
    },
    presence_webhook: {
      label: "Presence",
      class: "border-violet-500/20 bg-violet-500/10 text-violet-700 dark:text-violet-300",
      icon: Users,
    },
    soketi_webhook: {
      label: "Soketi",
      class: "border-blue-500/20 bg-blue-500/10 text-blue-700 dark:text-blue-300",
      icon: Webhook,
    },
  };

  const config = sourceConfig[source] ?? {
    label: source,
    class: "border-gray-500/20 bg-gray-500/10 text-gray-700 dark:text-gray-300",
    icon: Webhook,
  };

  return h(
    Badge,
    {
      variant: "outline",
      class: `max-w-[120px] truncate ${config.class}`,
    },
    () => [
      h(config.icon, { size: 12, class: "mr-1" }),
      config.label,
    ],
  );
}

function getEventTypeBadge(eventType: string | null) {
  if (!eventType) return null;

  const typeConfig: Record<string, string> = {
    client_event: "border-sky-500/20 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    channel_occupied: "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300",
    channel_vacated: "border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-300",
    member_added: "border-purple-500/20 bg-purple-500/10 text-purple-700 dark:text-purple-300",
    member_removed: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
    publish_failed: "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300",
  };

  const cls = typeConfig[eventType] ?? "border-gray-500/20 bg-gray-500/10 text-gray-700 dark:text-gray-300";

  return h(
    Badge,
    {
      variant: "outline",
      class: `max-w-[160px] truncate ${cls}`,
    },
    () => eventType,
  );
}

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
      accessorKey: "source",
      header: ({ column }) =>
        h(DataTableColumnHeader<Message, any>, { column, title: "Source" }),
      cell: ({ row }) => {
        const source = row.getValue("source") as string;
        return getSourceBadge(source);
      },
      size: 120,
      enableHiding: true,
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
        const eventType = row.original.event_type;

        return h("div", { class: "flex flex-col gap-1" }, [
          h(
            "span",
            { class: "max-w-[240px] truncate font-medium text-sm" },
            event,
          ),
          eventType ? getEventTypeBadge(eventType) : null,
        ].filter(Boolean));
      },
      enableHiding: false,
    },
    {
      accessorKey: "socket_id",
      header: ({ column }) =>
        h(DataTableColumnHeader<Message, any>, { column, title: "Socket ID" }),
      cell: ({ row }) => {
        const socketId = row.getValue("socket_id") as string | null;
        if (!socketId) {
          return h("span", { class: "text-muted-foreground text-xs" }, "—");
        }
        return h(
          "span",
          { class: "max-w-[180px] truncate font-mono text-xs text-muted-foreground" },
          socketId,
        );
      },
      size: 140,
      enableHiding: true,
    },
    {
      accessorKey: "user_id",
      header: ({ column }) =>
        h(DataTableColumnHeader<Message, any>, { column, title: "User ID" }),
      cell: ({ row }) => {
        const userId = row.getValue("user_id") as string | null;
        if (!userId) {
          return h("span", { class: "text-muted-foreground text-xs" }, "—");
        }
        return h(
          "span",
          { class: "max-w-[180px] truncate font-mono text-xs text-muted-foreground" },
          userId,
        );
      },
      size: 140,
      enableHiding: true,
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
