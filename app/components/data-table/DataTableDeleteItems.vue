<template>
  <AlertDialog v-if="table.getSelectedRowModel().rows.length > 0">
    <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        class="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive/50 dark:text-destructive/50 dark:hover:bg-destructive/10 dark:hover:text-destructive/50"
      >
        <LucideTrash class="-ms-1 opacity-80" :size="16" aria-hidden="true" />
        Delete
        <span
          class="bg-background text-destructive/70 -me-1 inline-flex h-5 max-h-full items-center rounded border border-destructive px-1 font-[inherit] text-[0.625rem] font-medium"
        >
          {{ table.getSelectedRowModel().rows.length }}
        </span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <div class="flex flex-col gap-2 max-sm:items-center sm:flex-row sm:gap-4">
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <LucideCircleAlert class="opacity-80" :size="16" />
        </div>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete
            {{ table.getSelectedRowModel().rows.length }} selected
            {{
              table.getSelectedRowModel().rows.length === 1 ? "row" : "rows"
            }}.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="
            emit(
              'remove:rows',
              table.getSelectedRowModel().rows.map((row) => row.original),
            )
          "
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup generic="TData">
import type { Table } from "@tanstack/vue-table";
import { LucideCircleAlert, LucideTrash } from "lucide-vue-next";

interface Props {
  table: Table<TData>;
}

const props = defineProps<Props>();
const emit = defineEmits(["remove:rows"]);
</script>
