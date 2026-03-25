<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex items-center space-x-2">
      <p class="text-sm font-medium">Rows per page</p>
      <Select
        :model-value="`${table.getState().pagination.pageSize}`"
        @update:model-value="(value) => table.setPageSize(Number(value))"
      >
        <SelectTrigger class="h-8 w-17.5">
          <SelectValue
            :placeholder="`${table.getState().pagination.pageSize}`"
          />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectItem
            v-for="pageSize in [10, 25, 50, 100]"
            :key="pageSize"
            :value="`${pageSize}`"
          >
            {{ pageSize }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div
        class="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap"
      >
        <p
          class="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span class="text-foreground">
            {{
              table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
              1
            }}-{{
              Math.min(
                Math.max(
                  table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                    table.getState().pagination.pageSize,
                  0,
                ),
                table.getRowCount(),
              )
            }}
          </span>
          of
          <span class="text-foreground">
            {{ table.getRowCount().toString() }}
          </span>
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden lg:flex size-9"
          :disabled="!table.getCanPreviousPage()"
          @click="table.setPageIndex(0)"
        >
          <LucideChevronFirst class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="size-9"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          <LucideChevronLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="size-9"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          <LucideChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden lg:flex size-9"
          :disabled="!table.getCanNextPage()"
          @click="table.setPageIndex(table.getPageCount() - 1)"
        >
          <LucideChevronLast class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import { type Table } from "@tanstack/vue-table";
import {
  LucideChevronFirst,
  LucideChevronLast,
  LucideChevronLeft,
  LucideChevronRight,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTablePaginationProps {
  table: Table<TData>;
}
defineProps<DataTablePaginationProps>();
</script>
