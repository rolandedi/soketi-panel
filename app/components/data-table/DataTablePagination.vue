<template>
  <div class="flex items-center justify-between px-2">
    <div class="flex items-center space-x-2">
      <p class="text-sm font-medium">Rows per page</p>
      <Select v-model="pageSize">
        <SelectTrigger class="h-8 w-17.5" :disabled="pagination?.total === 0">
          <SelectValue :placeholder="`${pagination.perPage}`" />
        </SelectTrigger>
        <SelectContent side="top">
          <SelectItem v-for="item in pageSizes" :key="item" :value="`${item}`">
            {{ item }}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <div class="flex items-center space-x-6 lg:space-x-8">
      <div
        class="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap"
      >
        <p
          class="text-muted-foreground text-sm whitespace-nowrap"
          aria-live="polite"
        >
          <span v-if="pagination" class="text-foreground">
            {{ start }}-{{ end }}
          </span>
          of
          <span class="text-foreground">
            {{ pagination.total }}
          </span>
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <Button
          variant="outline"
          class="hidden lg:flex size-9"
          :disabled="pagination.currentPage <= 1"
          @click="emit('paginate', 1)"
        >
          <LucideChevronFirst class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="size-9"
          :disabled="pagination.currentPage <= 1"
          @click="emit('paginate', Math.max(1, pagination.currentPage - 1))"
        >
          <LucideChevronLeft class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="size-9"
          :disabled="pagination.currentPage >= lastPage"
          @click="
            emit('paginate', Math.min(lastPage, pagination.currentPage + 1))
          "
        >
          <LucideChevronRight class="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          class="hidden lg:flex size-9"
          :disabled="pagination.currentPage >= lastPage"
          @click="emit('paginate', lastPage)"
        >
          <LucideChevronLast class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData">
import {
  LucideChevronFirst,
  LucideChevronLast,
  LucideChevronLeft,
  LucideChevronRight,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  pageSizes?: number[];
  pagination?: {
    currentPage: number;
    perPage: number;
    total: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [10, 25, 50, 100],
  pagination: () => ({
    currentPage: 1,
    perPage: 10,
    total: 0,
  }),
});

const emit = defineEmits<{
  (e: "change:size", perPage: number): void;
  (e: "paginate", currentPage: number): void;
}>();

const pageSize = ref(props.pagination.perPage);

const lastPage = computed(() => {
  const per = props.pagination.perPage || 1;
  return Math.max(1, Math.ceil(props.pagination.total / per));
});

const start = computed(() => {
  if (!props.pagination || props.pagination.total === 0) return 0;
  return (props.pagination.currentPage - 1) * props.pagination.perPage + 1;
});

const end = computed(() => {
  if (!props.pagination) return 0;
  return Math.min(
    props.pagination.currentPage * props.pagination.perPage,
    props.pagination.total,
  );
});

watch(pageSize, (newSize) => {
  emit("change:size", Number(newSize));
});
</script>
