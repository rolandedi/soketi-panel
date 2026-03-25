<template>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <a href="#" class="flex items-center gap-2 self-center font-medium">
        <div
          class="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md"
        >
          <RocketIcon class="size-4" />
        </div>
        Soketi Panel
      </a>

      <div :class="cn(props.class)">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { RocketIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
