<template>
  <div :class="cn('flex flex-1 items-center gap-3', props.class)">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { HTMLAttributes } from "vue";

import { cn } from "@/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
}

const props = defineProps<Props>();
</script>
