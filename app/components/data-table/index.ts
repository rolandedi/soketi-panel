import { ref, type Ref } from "vue";
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/vue-table";

export { default as DataTable } from "./DataTable.vue";
export { default as DataTableColumnHeader } from "./DataTableColumnHeader.vue";
export { default as DataTablePagination } from "./DataTablePagination.vue";
export { default as DataTableToolbar } from "./DataTableToolbar.vue";
export { default as DataTableViewOptions } from "./DataTableViewOptions.vue";
export { default as DataTableFacetedFilter } from "./DataTableFacetedFilter.vue";
export { default as DataTableRowActions } from "./DataTableRowActions.vue";
export { default as DataTableSkeleton } from "./DataTableSkeleton.vue";

export const useDataTable = <TData, TValue>(
  items: Ref<TData[]>,
  columns: ColumnDef<TData, TValue>[],
) => {
  const sorting = ref<SortingState>([]);
  const columnFilters = ref<ColumnFiltersState>([]);
  const columnVisibility = ref<VisibilityState>({});
  const rowSelection = ref({});

  const table = useVueTable<TData>({
    get data() {
      return items.value;
    },
    get columns() {
      return columns;
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

  return {
    table,
    sorting,
    columnFilters,
    columnVisibility,
    rowSelection,
  };
};
