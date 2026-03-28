<template>
  <AlertDialog v-if="selectedRows.length > 0">
    <AlertDialogTrigger asChild>
      <Button
        variant="outline"
        class="border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive dark:border-destructive/50 dark:text-destructive/50 dark:hover:bg-destructive/10 dark:hover:text-destructive/50"
      >
        <LucideTrash class="-ms-1 opacity-80" :size="16" aria-hidden="true" />
        {{ triggerLabel }}
        <span
          class="bg-background text-destructive/70 -me-1 inline-flex h-5 max-h-full items-center rounded border border-destructive px-1 font-[inherit] text-[0.625rem] font-medium"
        >
          {{ selectedRows.length }}
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
            {{ selectedRows.length }} selected
            {{ selectedRows.length === 1 ? "row" : "rows" }}.
          </AlertDialogDescription>
        </AlertDialogHeader>
      </div>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          @click="handleDelete"
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
  triggerLabel?: string;
}

withDefaults(defineProps<Props>(), {
  triggerLabel: "Delete",
});

const emit = defineEmits(["remove:rows"]);

const table = inject<Table<TData>>("table");

const selectedRows = computed(() => table?.getSelectedRowModel().rows ?? []);

function handleDelete() {
  emit("remove:rows", selectedRows.value.map((row) => row.original) ?? []);
}
</script>
