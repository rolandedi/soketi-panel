<template>
  <div
    class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10"
  >
    <div class="flex w-full max-w-sm flex-col gap-6">
      <a href="#" class="flex items-center gap-2 self-center">
        <img src="/logo.png" alt="Soketi Panel" class="size-6" />
        <span class="text-base font-normal">Soketi Panel</span>
      </a>

      <div :class="cn(props.class)">
        <slot />
      </div>
    </div>
  </div>

  <Toaster position="top-center" richColors />
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { cn } from "@/lib/utils";

const props = defineProps<{
  class?: HTMLAttributes["class"];
}>();
</script>
