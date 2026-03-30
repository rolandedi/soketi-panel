<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline">
        <FilterIcon class="size-4" />
        Filter
        <template v-if="activeFiltersCount > 0">
          <Separator orientation="vertical" class="mx-1 h-3" />
          <Badge variant="secondary" class="rounded-sm px-1 font-normal">
            {{ activeFiltersCount }}
          </Badge>
        </template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80" align="start">
      <div class="grid gap-3">
        <div class="space-y-1.5">
          <Label for="filter-status" class="text-xs text-muted-foreground">
            Status
          </Label>
          <Select
            v-model="form.enabled"
            @update:model-value="(value) => applyFilter('enabled', value)"
          >
            <SelectTrigger id="filter-status" class="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label for="filter-created-at" class="text-xs text-muted-foreground">
            Created
          </Label>
          <Select
            v-model="form.createdAt"
            @update:model-value="(value) => applyFilter('created_at', value)"
          >
            <SelectTrigger id="filter-created-at" class="w-full">
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="6m">Last 6 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <template v-if="activeFiltersCount > 0">
        <Separator class="my-3" />
        <Button variant="ghost" size="sm" @click="clearFilters">
          Clear filters
        </Button>
      </template>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { Table } from "@tanstack/vue-table";
import { computed, reactive } from "vue";
import { FilterIcon } from "lucide-vue-next";

import type { AcceptableValue } from "reka-ui";
import type { Application } from "#shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  table: Table<Application>;
}

const props = defineProps<Props>();

const form = reactive({
  enabled: undefined as string | undefined,
  createdAt: undefined as string | undefined,
});

const activeFiltersCount = computed(() => {
  return [form.enabled, form.createdAt].filter(Boolean).length;
});

function applyFilter(column: string, value: AcceptableValue) {
  props.table.getColumn(column)?.setFilterValue(value ?? undefined);
}

function clearFilters() {
  form.enabled = undefined;
  form.createdAt = undefined;
  props.table.getColumn("enabled")?.setFilterValue(undefined);
  props.table.getColumn("created_at")?.setFilterValue(undefined);
}
</script>
