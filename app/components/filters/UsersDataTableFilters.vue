<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        <FilterIcon class="size-4" />
        Filter
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge variant="secondary" class="rounded-sm px-1 font-normal">
            {{ selectedValues.size }}
          </Badge>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-50 p-3" align="start">
      <div class="space-y-3">
        <div
          v-for="option in filterOptions"
          :key="option.value"
          class="flex items-center space-x-2"
        >
          <Checkbox
            :id="option.value"
            :checked="selectedValues.has(option.value)"
            @update:model-value="
              (checked) => handleSelect(option.value, !!checked)
            "
          />
          <Label
            :for="option.value"
            class="flex flex-1 items-center justify-between text-sm font-normal"
          >
            <div class="flex items-center">
              <component
                :is="option.icon"
                v-if="option.icon"
                class="mr-2 h-4 w-4 text-muted-foreground"
              />
              {{ option.label }}
            </div>
            <span
              v-if="facets?.get(option.value)"
              class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs"
            >
              {{ facets.get(option.value) }}
            </span>
          </Label>
        </div>
        <template v-if="selectedValues.size > 0">
          <Separator />
          <Button
            variant="ghost"
            size="sm"
            class="w-full justify-center text-xs"
            @click="filterColumn?.setFilterValue(undefined)"
          >
            Clear filters
          </Button>
        </template>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { Component } from "vue";
import type { Table } from "@tanstack/vue-table";
import { FilterIcon } from "lucide-vue-next";

import type { User } from "~~/shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface FilterOption {
  label: string;
  value: string;
  icon?: Component;
}

interface Props {
  table: Table<User>;
}

const props = defineProps<Props>();

const filterOptions: FilterOption[] = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

const filterColumn = computed(() => {
  return props.table?.getColumn("role");
});

const selectedValues = computed(
  () => new Set(filterColumn.value?.getFilterValue() as string[]),
);

const facets = computed(() => filterColumn.value?.getFacetedUniqueValues());

function handleSelect(value: string, checked: boolean) {
  if (checked) {
    selectedValues.value.add(value);
  } else {
    selectedValues.value.delete(value);
  }

  const filterValues = Array.from(selectedValues.value);
  filterColumn.value?.setFilterValue(
    filterValues.length ? filterValues : undefined,
  );
}
</script>
