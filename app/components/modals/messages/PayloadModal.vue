<template>
  <Dialog v-model:open="open">
    <DialogContent class="sm:max-w-3xl">
      <DialogHeader>
        <DialogTitle>Payload</DialogTitle>
        <DialogDescription>
          Inspect the JSON payload attached to this message.
        </DialogDescription>
      </DialogHeader>

      <div class="mt-2 overflow-hidden rounded-lg border bg-muted/30">
        <CodeBlock language="json" class="max-h-[70vh] overflow-auto">
          {{ formattedPayload }}
        </CodeBlock>
      </div>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { PropType } from "vue";

import CodeBlock from "@/components/CodeBlock.vue";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const open = defineModel<boolean>("open", { default: false });

const props = defineProps({
  payload: {
    type: null as PropType<unknown>,
    required: true,
  },
});

const formattedPayload = computed(() => {
  if (typeof props.payload === "string") {
    try {
      return JSON.stringify(JSON.parse(props.payload), null, 2);
    } catch {
      return props.payload;
    }
  }

  try {
    return JSON.stringify(props.payload ?? {}, null, 2);
  } catch {
    return String(props.payload ?? "");
  }
});
</script>
