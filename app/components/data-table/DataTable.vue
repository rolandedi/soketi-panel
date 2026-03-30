<template>
  <div class="space-y-4">
    <DataTableToolbar>
      <DataTableToolbarStart>
        <DataTableSearchInput v-if="searchColumn" :column="searchColumn" />
        <slot name="toolbarStart" />

        <DataTableDeleteItems @remove:rows="emit('remove:rows', $event)" />
      </DataTableToolbarStart>
      <DataTableToolbarEnd>
        <DataTableToggleColumns v-if="canToggleColumns" />

        <slot name="toolbarEnd" />
      </DataTableToolbarEnd>
    </DataTableToolbar>
    <div
      class="rounded-md border bg-card relative wrap-break-word overflow-hidden"
    >
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
    <DataTablePagination
      :pagination="pagination"
      :page-sizes="pageSizes"
      @paginate="handlePageChange"
      @change:size="handlePageSizeChange"
    />
  </div>
</template>

<script setup lang="ts" generic="TData, TValue">
import { computed } from "vue";
import { FlexRender, type ColumnDef } from "@tanstack/vue-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useDataTable } from "./index";
import DataTableToolbar from "./DataTableToolbar.vue";
import DataTableContainer from "./DataTableContainer.vue";
import DataTablePagination from "./DataTablePagination.vue";
import DataTableDeleteItems from "./DataTableDeleteItems.vue";
import DataTableToggleColumns from "./DataTableToggleColumns.vue";

interface Props {
  columns: ColumnDef<TData, TValue>[];
  searchColumn?: string | string[];
  loading?: boolean;
  leftSticky?: boolean;
  rightSticky?: boolean;
  pageSizes?: number[];
  pagination?: {
    currentPage: number;
    perPage: number;
    total: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  leftSticky: false,
  rightSticky: false,
  pageSizes: () => [10, 25, 50, 100],
});
const emit = defineEmits<{
  (e: "update:pagination", perPage: number, currentPage: number): void;
  (e: "remove:rows", items: TData[]): void;
}>();

const data = defineModel<TData[]>({ default: [] });
const { table } = useDataTable<TData, TValue>(data, props.columns, {
  globalFilterColumns: props.searchColumn
    ? Array.isArray(props.searchColumn)
      ? props.searchColumn
      : [props.searchColumn]
    : [],
});

const loading = computed(() => props.loading || false);
const canToggleColumns = computed(() => table.getAllColumns().length > 0);

function handlePageChange(newPage: number) {
  emit("update:pagination", props.pagination?.perPage || 10, newPage);
}

function handlePageSizeChange(newSize: number) {
  emit("update:pagination", newSize, props.pagination?.currentPage || 1);
}

defineExpose({ table });
provide("table", table);
</script>
