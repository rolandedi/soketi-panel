<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" class="hidden lg:flex">
        <LucideColumns3 class="size-4" />
        View
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" class="min-w-37.5">
      <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem
        v-for="column in table
          .getAllColumns()
          .filter((column) => column.getCanHide())"
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
  table: Table<TData>;
}

defineProps<Props>();
</script>
