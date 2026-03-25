<template>
  <div
    class="min-h-screen bg-background text-foreground flex-1 flex flex-col min-w-0"
  >
    <Navbar />

    <main class="flex-1 overflow-x-hidden overflow-y-auto">
      <div :class="cn('max-w-6xl mx-auto p-4 md:p-6', props.class)">
        <slot />
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";
import Navbar from "~/components/Navbar.vue";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>
