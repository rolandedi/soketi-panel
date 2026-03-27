<template>
  <TableRow v-for="row in Array(length)" :key="row">
    <TableCell
      v-for="(col, idx) in Array(columnsLength)"
      :key="idx"
      class="align-middle"
      :class="{
        'pl-3': idx === 0,
        'text-right': idx === columnsLength - 1,
      }"
    >
      <Skeleton
        class="inline-block h-5"
        :class="[
          idx === 0 || idx === columnsLength - 1
            ? 'w-5'
            : ['w-12', 'w-16', 'w-20', 'w-24', 'w-32'][
                Math.floor(Math.random() * 5)
              ],
        ]"
      />
    </TableCell>
  </TableRow>
</template>

<script lang="ts" setup>
import { Skeleton } from "@/components/ui/skeleton";
import { TableRow, TableCell } from "@/components/ui/table";

interface Props {
  length?: number;
  columnsLength: number;
}

const props = withDefaults(defineProps<Props>(), {
  length: 5,
});
</script>
