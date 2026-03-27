<template>
  <div
    v-if="column.getCanSort()"
    :class="cn('flex items-center space-x-2', $attrs.class ?? '')"
  >
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          class="-ml-3 h-8 data-[state=open]:bg-accent"
        >
          <span>{{ title }}</span>
          <LucideArrowDown
            v-if="column.getIsSorted() === 'desc'"
            class="ml-2 size-4"
          />
          <LucideArrowUp
            v-else-if="column.getIsSorted() === 'asc'"
            class="ml-2 size-4"
          />
          <LucideChevronsUpDown v-else class="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem @click="column.toggleSorting(false)">
          <ArrowUpNarrowWide class="size-3.5 text-muted-foreground/70" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem @click="column.toggleSorting(true)">
          <ArrowDownNarrowWide class="size-3.5 text-muted-foreground/70" />
          Desc
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem @click="column.toggleVisibility(false)">
          <LucideEyeOff class="size-3.5 text-muted-foreground/70" />
          Hide
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
  <div v-else :class="$attrs.class">
    {{ title }}
  </div>
</template>

<script setup lang="ts" generic="TData, TValue">
import type { Column } from "@tanstack/vue-table";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  LucideArrowDown,
  LucideArrowUp,
  LucideChevronsUpDown,
  LucideEyeOff,
} from "lucide-vue-next";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableColumnHeaderProps {
  column: Column<TData, TValue>;
  title: string;
}

defineProps<DataTableColumnHeaderProps>();
</script>
