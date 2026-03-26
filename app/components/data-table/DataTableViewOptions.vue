<script setup lang="ts" generic="TData">
import { computed } from "vue";
import { type Table } from "@tanstack/vue-table";
import { LucideColumns3 } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps {
  table: Table<TData>;
}

const props = defineProps<DataTableViewOptionsProps>();

const columns = computed(() => {
  // Force tracking of column visibility changes
  const _ = props.table.getState().columnVisibility;
  return props.table.getAllColumns().filter((column) => column.getCanHide());
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" class="hidden lg:flex">
        <LucideColumns3 class="size-4" />
        View
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="w-37.5">
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        v-for="column in columns"
        :key="column.id"
        class="capitalize"
        :checked="column.getIsVisible()"
        @update:checked="(value: boolean) => column.toggleVisibility(!!value)"
      >
        {{ column.id }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
