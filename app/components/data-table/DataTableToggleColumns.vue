<template>
  <DropdownMenu v-if="items.length > 0">
    <DropdownMenuTrigger asChild>
      <Button variant="outline" class="hidden lg:flex" :disabled="tableIsEmpty">
        <LucideColumns3 class="size-4" />
        {{ triggerLabel }}
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-37.5">
      <DropdownMenuLabel>{{ header }}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        v-for="column in items"
        :key="column.id"
        class="capitalize"
        :model-value="column.getIsVisible()"
        @update:model-value="(value) => column.toggleVisibility(!!value)"
        @select="(event) => event.preventDefault()"
      >
        {{ column.id }}
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts" generic="TData">
import { computed, inject } from "vue";
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

interface Props {
  header?: string;
  triggerLabel?: string;
}

withDefaults(defineProps<Props>(), {
  header: "Toggle columns",
  triggerLabel: "View",
});

const table = inject<Table<TData>>("table");

const items = computed(
  () => table?.getAllColumns().filter((i) => i.getCanHide()) ?? [],
);

const tableIsEmpty = computed(() => {
  const rowModel = table?.getRowModel();
  return !rowModel || rowModel.rows.length === 0;
});
</script>
