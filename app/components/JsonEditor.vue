<template>
  <div
    :class="
      cn(
        'relative overflow-hidden rounded-md border border-input bg-transparent text-sm transition-colors focus-within:outline-none focus-within:ring-1 focus-within:ring-ring',
        props.class,
      )
    "
  >
    <Codemirror
      :model-value="modelValue"
      :extensions="extensions"
      :tab-size="2"
      :indent-with-tab="true"
      :autofocus="false"
      :disabled="false"
      @update:model-value="$emit('update:modelValue', $event)"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, type HTMLAttributes } from "vue";
import { Codemirror } from "vue-codemirror";
import { json } from "@codemirror/lang-json";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorView } from "@codemirror/view";
import { cn } from "@/lib/utils";

interface Props {
  modelValue: string;
  class?: HTMLAttributes["class"];
  minHeight?: string;
  theme?: string;
  mode?: "light" | "dark";
}

const props = withDefaults(defineProps<Props>(), {
  minHeight: "14rem",
  mode: "light",
});

defineEmits<{
  "update:modelValue": [value: string];
}>();

const baseTheme = EditorView.theme({
  "&": {
    fontFamily: "var(--font-mono, ui-monospace, monospace)",
    fontSize: "0.8125rem",
    lineHeight: "1.6",
    minHeight: props.minHeight,
  },
  ".cm-scroller": {
    overflow: "auto",
    minHeight: "inherit",
    maxHeight: "28rem",
  },
  "&.cm-editor": {
    outline: "none",
  },
  ".cm-content": {
    padding: "0.75rem 0",
    caretColor: "currentColor",
  },
  ".cm-line": {
    padding: "0 0.75rem",
  },
  "&.cm-editor .cm-selectionBackground, .cm-selectionBackground, .cm-focused .cm-selectionBackground":
    { background: "color-mix(in srgb, var(--color-primary) 20%, transparent)" },
});

const lightTheme = EditorView.theme({
  "&": {
    backgroundColor: "transparent",
    color: "var(--color-foreground)",
  },
  ".cm-gutters": {
    backgroundColor: "transparent",
    borderRight: "1px solid var(--color-border)",
    color: "var(--color-muted-foreground)",
  },
  ".cm-activeLineGutter": {
    backgroundColor: "color-mix(in srgb, var(--color-muted) 60%, transparent)",
  },
  ".cm-activeLine": {
    backgroundColor: "color-mix(in srgb, var(--color-muted) 40%, transparent)",
  },
  ".cm-cursor": {
    borderLeftColor: "var(--color-foreground)",
  },
});

const editorTheme = computed(() => {
  if (props.theme) {
    return props.theme;
  }

  return props.mode === "dark" ? oneDark : lightTheme;
});

const extensions = computed(() => {
  return [json(), baseTheme, editorTheme.value];
});
</script>
