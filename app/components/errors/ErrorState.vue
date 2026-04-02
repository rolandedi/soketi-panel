<template>
  <div class="relative min-h-svh overflow-hidden bg-background text-foreground">
    <div class="pointer-events-none absolute inset-0 bg-background" />
    <div
      class="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
    />
    <div
      class="pointer-events-none absolute -bottom-32 -right-16 h-72 w-72 rounded-full bg-muted-foreground/10 blur-3xl"
    />

    <div
      class="relative flex min-h-svh items-center justify-center p-6 md:p-10"
    >
      <Card>
        <CardContent class="space-y-8 p-6 md:p-10">
          <div
            class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between"
          >
            <div class="space-y-3">
              <p
                class="text-4xl md:text-7xl font-extrabold leading-none uppercase tracking-widest"
              >
                {{ state.code }}
              </p>
              <h1
                class="text-lg md:text-xl font-semibold leading-none text-muted-foreground"
              >
                {{ state.title }}
              </h1>
              <p
                class="max-w-xl text-sm leading-6 text-muted-foreground md:text-base"
              >
                {{ state.description }}
              </p>
            </div>
          </div>

          <slot name="details" />

          <div class="flex flex-wrap gap-3">
            <slot name="actions" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { Card, CardContent } from "@/components/ui/card";
import type { ErrorState } from "~/lib/error-state";

interface Props {
  state: ErrorState;
}

const props = defineProps<Props>();

const toneClasses = computed(() => {
  switch (props.state.variant) {
    case "info":
      return "border-primary/20 bg-primary/10 text-primary";
    case "warning":
      return "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400";
    case "danger":
      return "border-destructive/20 bg-destructive/10 text-destructive";
    default:
      return "border-primary/20 bg-primary/10 text-primary";
  }
});
</script>
