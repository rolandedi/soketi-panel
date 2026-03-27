<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const emit = defineEmits<{
  (e: "scroll", event: Event): void;
}>();

const props = defineProps<{
  class?: HTMLAttributes["class"];
  containerClass?: HTMLAttributes["class"];
}>();
</script>

<template>
  <div
    data-slot="table-container"
    :class="cn('relative w-full overflow-auto', props.containerClass)"
    @scroll="emit('scroll', $event)"
  >
    <table
      data-slot="table"
      :class="cn('w-full caption-bottom text-sm', props.class)"
    >
      <slot />
    </table>
  </div>
</template>
