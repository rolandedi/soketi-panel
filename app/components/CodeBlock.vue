<template>
  <div :class="cn('rounded-lg overflow-hidden max-w-full', props.class)">
    <div v-if="isLoading" class="p-4">
      <div class="animate-pulse bg-accent rounded h-32"></div>
    </div>
    <div v-else-if="error" class="p-4">
      <pre
        class="p-4 rounded-lg overflow-x-auto font-mono text-sm leading-normal"
      >
        <slot />
      </pre>
    </div>
    <div
      v-else
      class="[&_pre]:m-0 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_pre]:text-sm [&_pre]:font-mono [&_pre]:leading-[1.6] [&_pre]:wrap-break-word [&_pre]:whitespace-pre-wrap [&_pre]:overflow-wrap-anywhere [&_code]:block [&_pre::-webkit-scrollbar]:h-2 [&_pre::-webkit-scrollbar-track]:bg-black/10 [&_pre::-webkit-scrollbar-track]:rounded-full [&_pre::-webkit-scrollbar-thumb]:bg-white/30 [&_pre::-webkit-scrollbar-thumb]:rounded-full hover:[&_pre::-webkit-scrollbar-thumb]:bg-white/50"
      v-html="highlightedCode"
    ></div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  onMounted,
  watch,
  computed,
  useSlots,
  type HTMLAttributes,
} from "vue";
import { codeToHtml } from "shiki";
import { useColorMode } from "@vueuse/core";

import { cn } from "~/lib/utils";

interface Props {
  class?: HTMLAttributes["class"];
  language?: string;
  theme?: string;
}

const props = withDefaults(defineProps<Props>(), {
  language: "json",
});

const slots = useSlots();

const highlightedCode = ref("");
const isLoading = ref(true);
const error = ref(false);
const code = computed(() => {
  const mainSlot = slots.default;

  if (!mainSlot) {
    return "";
  }

  const firstNode = mainSlot()[0];

  if (!firstNode) {
    return "";
  }

  const code = firstNode.children;

  if (!code) {
    return "";
  }

  return code;
});

const colorMode = useColorMode();
const codeBlockTheme = computed(() => {
  if (props.theme) {
    return props.theme;
  }

  return colorMode.value === "dark" ? "dark-plus" : "catppuccin-latte";
});

const highlight = async () => {
  try {
    isLoading.value = true;
    error.value = false;

    // Format JSON if language is json
    let codeToHighlight = code.value;
    if (props.language === "json") {
      try {
        const parsed =
          typeof code.value === "string" ? JSON.parse(code.value) : code.value;
        codeToHighlight = JSON.stringify(parsed, null, 2);
      } catch {
        // If parsing fails, use the original code
        codeToHighlight = code.value;
      }
    }

    highlightedCode.value = await codeToHtml(codeToHighlight as string, {
      lang: props.language,
      theme: codeBlockTheme.value,
    });
  } catch (err) {
    console.error("Failed to highlight code:", err);
    error.value = true;
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  highlight();
});

watch(() => [code.value, props.language, props.theme], highlight);
</script>
