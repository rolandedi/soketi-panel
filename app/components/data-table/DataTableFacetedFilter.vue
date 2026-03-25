<script setup lang="ts" generic="TData, TValue">
import { computed, type Component } from "vue";
import {
  LucideFilter,
  LucideListFilter,
  LucidePlusCircle,
} from "lucide-vue-next";
import type { Column } from "@tanstack/vue-table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataTableFacetedFilterProps {
  column?: Column<TData, TValue>;
  title?: string;
  options: {
    label: string;
    value: string;
    icon?: Component;
  }[];
}

const props = defineProps<DataTableFacetedFilterProps>();

const selectedValues = computed(
  () => new Set(props.column?.getFilterValue() as string[]),
);

function handleSelect(value: string, checked: boolean) {
  if (checked) {
    selectedValues.value.add(value);
  } else {
    selectedValues.value.delete(value);
  }
  const filterValues = Array.from(selectedValues.value);
  props.column?.setFilterValue(filterValues.length ? filterValues : undefined);
}

const facets = computed(() => props.column?.getFacetedUniqueValues());
</script>

<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        <LucideFilter class="size-4" />
        {{ title }}
        <template v-if="selectedValues.size > 0">
          <Separator orientation="vertical" class="mx-2 h-4" />
          <Badge
            variant="secondary"
            class="rounded-sm px-1 font-normal lg:hidden"
          >
            {{ selectedValues.size }}
          </Badge>
          <div class="hidden space-x-1 lg:flex">
            <Badge
              v-if="selectedValues.size > 2"
              variant="secondary"
              class="rounded-sm px-1 font-normal"
            >
              {{ selectedValues.size }} selected
            </Badge>
            <template v-else>
              <Badge
                v-for="option in options.filter((opt) =>
                  selectedValues.has(opt.value),
                )"
                :key="option.value"
                variant="secondary"
                class="rounded-sm px-1 font-normal"
              >
                {{ option.label }}
              </Badge>
            </template>
          </div>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-50 p-3" align="start">
      <div class="space-y-3">
        <div
          v-for="option in options"
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
            @click="column?.setFilterValue(undefined)"
          >
            Clear filters
          </Button>
        </template>
      </div>
    </PopoverContent>
  </Popover>
</template>
