<template>
  <div class="relative">
    <Input
      :placeholder="props.placeholder"
      :class="cn('peer ps-9 min-w-72', props.class)"
      :model-value="getFilterValue()"
      @input="onInput"
    />
    <div
      class="text-muted-foreground/80 pointer-events-none absolute inset-y-0 inset-s-0 flex items-center justify-center ps-3 peer-disabled:opacity-50"
    >
      <LucideListFilter :size="16" aria-hidden="true" />
    </div>
    <button
      v-if="Boolean(getFilterValue())"
      class="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 inset-e-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
      aria-label="Clear filter"
      @click="clearFilter"
    >
      <LucideCircleX :size="16" aria-hidden="true" />
    </button>
  </div>
</template>

<script lang="ts" setup generic="TData">
import type { HTMLAttributes } from "vue";
import type { Table } from "@tanstack/vue-table";
import { LucideCircleX, LucideListFilter } from "lucide-vue-next";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface Props {
  class?: HTMLAttributes["class"];
  column?: string | string[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Search in table...",
});

const table = inject<Table<TData>>("table");

function getFilterValue(): string {
  if (Array.isArray(props.column)) {
    return (table?.getState().globalFilter as string) ?? "";
  }
  return (
    (props.column
      ? (table?.getColumn(props.column as string)?.getFilterValue() as string)
      : "") ?? ""
  );
}

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value;
  if (Array.isArray(props.column)) {
    table?.setGlobalFilter(value);
  } else {
    if (props.column)
      table?.getColumn(props.column as string)?.setFilterValue(value);
  }
}

function clearFilter() {
  if (Array.isArray(props.column)) {
    table?.setGlobalFilter("");
  } else {
    if (props.column)
      table?.getColumn(props.column as string)?.setFilterValue("");
  }
}
</script>
