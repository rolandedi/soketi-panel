<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" :disabled="tableIsEmpty">
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
    <PopoverContent class="w-96" align="start">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="space-y-1.5">
          <Label for="filter-role" class="text-xs text-muted-foreground">
            Role
          </Label>
          <Select
            v-model="form.role"
            @update:model-value="(v) => applyFilter('role', v)"
          >
            <SelectTrigger id="filter-role" class="w-full">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label for="filter-status" class="text-xs text-muted-foreground">
            Status
          </Label>
          <Select
            v-model="form.status"
            @update:model-value="(v) => applyFilter('status', v)"
          >
            <SelectTrigger id="filter-status" class="w-full">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label for="filter-banned" class="text-xs text-muted-foreground">
            Banned
          </Label>
          <Select
            v-model="form.banned"
            @update:model-value="(v) => applyFilter('banned', v)"
          >
            <SelectTrigger id="filter-banned" class="w-full">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="banned">Banned</SelectItem>
              <SelectItem value="not-banned">Not banned</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="space-y-1.5">
          <Label for="filter-created-at" class="text-xs text-muted-foreground">
            Created At
          </Label>
          <Select
            v-model="form.createdAt"
            @update:model-value="(v) => applyFilter('createdAt', v)"
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
import type { User } from "#shared/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  table: Table<User>;
}

const props = defineProps<Props>();

const form = reactive({
  role: undefined as string | undefined,
  status: undefined as string | undefined,
  banned: undefined as string | undefined,
  createdAt: undefined as string | undefined,
});

const activeFiltersCount = computed(() => {
  return [form.role, form.status, form.banned, form.createdAt].filter(Boolean)
    .length;
});

const tableIsEmpty = computed(() => {
  const rowModel = props.table?.getRowModel();
  return !rowModel || rowModel.rows.length === 0;
});

function applyFilter(column: string, value: AcceptableValue) {
  props.table.getColumn(column)?.setFilterValue(value ?? undefined);
}

function clearFilters() {
  form.role = undefined;
  form.status = undefined;
  form.banned = undefined;
  form.createdAt = undefined;
  props.table.getColumn("role")?.setFilterValue(undefined);
  props.table.getColumn("status")?.setFilterValue(undefined);
  props.table.getColumn("banned")?.setFilterValue(undefined);
  props.table.getColumn("createdAt")?.setFilterValue(undefined);
}
</script>
