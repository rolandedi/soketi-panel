<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center gap-3">
      <div class="relative">
        <Input
          v-if="filterColumn"
          :placeholder="`Search by ${filterColumn}...`"
          class="peer ps-9 min-w-72"
          :model-value="
            (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''
          "
          @input="
            table.getColumn(filterColumn)?.setFilterValue($event.target.value)
          "
        />
        <div
          class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"
        >
          <LucideListFilter :size="16" aria-hidden="true" />
        </div>
        <button
          v-if="Boolean(table.getColumn('name')?.getFilterValue())"
          class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Clear filter"
          @click="() => table.resetColumnFilters()"
        >
          <LucideCircleX :size="16" aria-hidden="true" />
        </button>
      </div>

      <slot name="afterSearch" />
    </div>
    <div class="flex items-center gap-2">
      <DataTableViewOptions v-if="isFiltered" :table="table" />

      <slot name="end" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import { computed } from "vue";
import { type Table } from "@tanstack/vue-table";
import { LucideCircleX, LucideListFilter } from "lucide-vue-next";

import { Input } from "@/components/ui/input";
import DataTableViewOptions from "./DataTableViewOptions.vue";

interface Props {
  table: Table<TData>;
  filterColumn?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["remove:rows"]);

const isFiltered = computed(() => props.table.getAllColumns().length > 0);
</script>
