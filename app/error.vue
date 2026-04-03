<template>
  <ErrorState :state="state">
    <template #details>
      <Alert
        v-if="details"
        variant="default"
        class="border-border/60 bg-muted/30"
      >
        <TriangleAlert class="h-4 w-4" />
        <AlertTitle>What you can do next</AlertTitle>
        <AlertDescription>
          {{ details }}
        </AlertDescription>
      </Alert>
    </template>

    <template #actions>
      <Button v-if="primaryAction.kind === 'link'" as-child>
        <NuxtLink :to="primaryAction.to">
          {{ primaryAction.label }}
        </NuxtLink>
      </Button>
      <Button v-else @click="primaryAction.onClick">
        {{ primaryAction.label }}
      </Button>

      <template v-if="secondaryAction.kind === 'link'">
        <Button variant="outline" as-child>
          <NuxtLink :to="secondaryAction.to">
            {{ secondaryAction.label }}
          </NuxtLink>
        </Button>
      </template>
      <Button
        v-else
        variant="outline"
        type="button"
        @click="secondaryAction.onClick"
      >
        {{ secondaryAction.label }}
      </Button>
    </template>
  </ErrorState>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { TriangleAlert } from "lucide-vue-next";

import { getErrorState } from "~/lib/error-state";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import ErrorState from "~/components/errors/ErrorState.vue";

type Action =
  | {
      kind: "link";
      label: string;
      to: string;
    }
  | {
      kind: "button";
      label: string;
      onClick: () => void;
    };

const props = defineProps<{
  error: {
    statusCode?: number;
    statusMessage?: string;
  };
}>();

const state = computed(() => getErrorState(props.error.statusCode));

useHead(() => ({
  title: `${state.value.title} - Soketi Panel`,
}));

const details = computed(() => {
  if (state.value.code === 500) {
    return "Try reloading the page. If the issue continues, return to the dashboard and try again later.";
  }

  if (state.value.code === 401 || state.value.code === 403) {
    return "If you think this is a mistake, sign in again or switch to an account with the right permissions.";
  }

  return "Return to the dashboard or go back to the previous page.";
});

const primaryAction = computed<Action>(() => {
  switch (state.value.code) {
    case 401:
      return {
        kind: "link",
        label: "Sign in",
        to: "/login",
      };
    case 403:
      return {
        kind: "link",
        label: "Go to dashboard",
        to: "/",
      };
    case 500:
      return {
        kind: "button",
        label: "Reload page",
        onClick: () => globalThis.location.reload(),
      };
    default:
      return {
        kind: "link",
        label: "Go to dashboard",
        to: "/",
      };
  }
});

const secondaryAction = computed<Action>(() => {
  switch (state.value.code) {
    case 401:
      return {
        kind: "link",
        label: "Go to dashboard",
        to: "/",
      };
    case 403:
      return {
        kind: "link",
        label: "Sign in",
        to: "/login",
      };
    case 404:
      return {
        kind: "button",
        label: "Go back",
        onClick: () => globalThis.history.back(),
      };
    case 500:
      return {
        kind: "link",
        label: "Go to dashboard",
        to: "/",
      };
    default:
      return {
        kind: "button",
        label: "Go back",
        onClick: () => globalThis.history.back(),
      };
  }
});
</script>
