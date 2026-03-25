<script setup lang="ts" generic="TData">
import { type Table } from "@tanstack/vue-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LucideX } from "lucide-vue-next"
import DataTableViewOptions from "./DataTableViewOptions.vue"
import DataTableFacetedFilter from "./DataTableFacetedFilter.vue"
import { computed } from "vue"

interface DataTableToolbarProps {
  table: Table<TData>
  filterColumn?: string
}

const props = defineProps<DataTableToolbarProps>()

const isFiltered = computed(() => props.table.getState().columnFilters.length > 0)

// Status options for the faceted filter (specific to User table but could be abstracted)
const statuses = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
  { label: "Pending", value: "Pending" },
]
</script>

<template>
  <div class="flex items-center justify-between">
    <div class="flex flex-1 items-center space-x-2">
      <Input
        v-if="filterColumn"
        placeholder="Filter..."
        :model-value="(table.getColumn(filterColumn)?.getFilterValue() as string) ?? ''"
        class="h-8 w-37.5 lg:w-62.5"
        @input="table.getColumn(filterColumn)?.setFilterValue($event.target.value)"
      />
      
      <DataTableFacetedFilter
        v-if="table.getColumn('status')"
        :column="table.getColumn('status')"
        title="Status"
        :options="statuses"
      />

      <Button
        v-if="isFiltered"
        variant="ghost"
        class="h-8 px-2 lg:px-3"
        @click="table.resetColumnFilters()"
      >
        Reset
        <LucideX class="ml-2 h-4 w-4" />
      </Button>
    </div>
    <DataTableViewOptions :table="table" />
  </div>
</template>
