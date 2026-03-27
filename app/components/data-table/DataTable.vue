<template>
  <div class="space-y-4">
    <DataTableToolbar :table="table" :filter-column="filterColumn" />
    <div class="rounded-md border bg-card overflow-y-hidden overflow-x-auto">
      <DataTableContainer v-slot="{ handleScroll }">
        <Table
          class="nds--table text-nowrap"
          container-class="overflow-y-hidden overflow-x-auto whitespace-nowrap"
          @scroll="handleScroll"
        >
          <TableHeader>
            <TableRow
              v-for="headerGroup in table.getHeaderGroups()"
              :key="headerGroup.id"
            >
              <TableHead
                v-for="(header, idx) in headerGroup.headers"
                :key="header.id"
                :class="{
                  'px-3': idx === 0 || idx === headerGroup.headers.length - 1,
                  'left-sticky sticky left-0 z-10 p-2! rounded-tl-xl bg-card':
                    leftSticky && idx === 0,
                  'right-sticky sticky right-0 z-10 rounded-tr-xl bg-card':
                    rightSticky && idx === headerGroup.headers.length - 1,
                }"
              >
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <template v-if="table.getRowModel().rows?.length">
              <TableRow
                v-for="row in table.getRowModel().rows"
                :key="row.id"
                class="group"
                :data-state="row.getIsSelected() && 'selected'"
              >
                <TableCell
                  v-for="(cell, idx) in row.getVisibleCells()"
                  :key="cell.id"
                  :class="{
                    'px-3':
                      idx === 0 || idx === row.getVisibleCells().length - 1,
                    'left-sticky sticky left-0 z-10 p-2! bg-card group-hover:bg-muted':
                      leftSticky && idx === 0,
                    'right-sticky sticky right-0 z-10 bg-card group-hover:bg-muted':
                      rightSticky && idx === row.getVisibleCells().length - 1,
                  }"
                >
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
            <template v-else>
              <TableRow v-if="!loading">
                <TableCell :colspan="columns.length" class="h-24 text-center">
                  <div>No results.</div>
                </TableCell>
              </TableRow>
              <template v-else>
                <template v-if="$slots.placeholder">
                  <slot name="placeholder" />
                </template>
                <template v-else>
                  <DataTableSkeleton :columns-length="columns.length" />
                </template>
              </template>
            </template>
          </TableBody>
        </Table>
      </DataTableContainer>
    </div>
    <DataTablePagination :table="table" :pagination="pagination" />
  </div>
</template>

<script setup lang="ts" generic="TData, TValue">
import { ref } from "vue";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  FlexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import DataTablePagination from "./DataTablePagination.vue";
import DataTableToolbar from "./DataTableToolbar.vue";
import DataTableContainer from "./DataTableContainer.vue";

interface Props {
  columns: ColumnDef<TData, TValue>[];
  filterColumn?: string;
  loading?: boolean;
  pagination?: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  leftSticky?: boolean;
  rightSticky?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  leftSticky: false,
  rightSticky: false,
});
const data = defineModel<TData[]>({ default: [] });

const loading = computed(() => props.loading || false);
const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>({});
const rowSelection = ref({});

const table = useVueTable({
  get data() {
    return data.value;
  },
  get columns() {
    return props.columns;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
    get rowSelection() {
      return rowSelection.value;
    },
  },
  onSortingChange: (updaterOrValue) => {
    sorting.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(sorting.value)
        : updaterOrValue;
  },
  onColumnFiltersChange: (updaterOrValue) => {
    columnFilters.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(columnFilters.value)
        : updaterOrValue;
  },
  onColumnVisibilityChange: (updaterOrValue) => {
    columnVisibility.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(columnVisibility.value)
        : updaterOrValue;
  },
  onRowSelectionChange: (updaterOrValue) => {
    rowSelection.value =
      typeof updaterOrValue === "function"
        ? updaterOrValue(rowSelection.value)
        : updaterOrValue;
  },
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
});

const handleDeleteRows = () => {
  const selectedRows = table.getSelectedRowModel().rows;
  const updatedData = data.value.filter((item: any) => {
    return !selectedRows.some((row: any) => row.original.id === item.id);
  });
  data.value = updatedData;
  table.resetRowSelection();
};
</script>
