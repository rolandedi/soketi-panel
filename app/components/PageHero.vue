<template>
  <div
    class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
  >
    <div>
      <h2 class="text-2xl md:text-3xl font-bold tracking-tight">{{ title }}</h2>
      <p v-if="description" class="text-muted-foreground">
        {{ description }}
      </p>
    </div>
    <div class="flex items-center gap-2">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title: string;
  description?: string;
}

const props = defineProps<Props>();
</script>
