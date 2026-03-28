<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-full justify-start text-left font-normal hover:bg-transparent hover:text-foreground/80',
            !modelValue && 'text-muted-foreground',
            props.class,
          )
        "
        type="button"
      >
        <CalendarIcon class="mr-2 size-4 shrink-0 opacity-60" />
        <span :class="{ 'text-muted-foreground': !displayValue }">
          {{ displayValue }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0" align="start">
      <Calendar
        v-model="calendarValue"
        :layout="layout"
        :locale="locale"
        :min-value="minDate"
        :max-value="maxDate"
        initial-focus
        @update:model-value="onSelect"
      />
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { DateValue } from "reka-ui";
import { computed } from "vue";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import { CalendarIcon } from "lucide-vue-next";

import { cn } from "@/lib/utils";
import { Calendar, type LayoutTypes } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  class?: HTMLAttributes["class"];
  minValue?: DateValue;
  maxValue?: DateValue;
  placeholder?: string;
  locale?: string;
  layout?: LayoutTypes;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Choose a date",
  layout: "month-and-year",
  locale: "en-US",
});

// v-model is a plain ISO string "YYYY-MM-DD" to integrate with vee-validate fields
const modelValue = defineModel<string | Date | undefined>();

// Defaults: allow dates from 110 years ago to today
const todayDate = today(getLocalTimeZone());
const minDate = computed(
  () => props.minValue ?? todayDate.subtract({ years: 110 }),
);
const maxDate = computed(() => props.maxValue ?? todayDate);

// Convert the string model to a CalendarDate for the Calendar component
const calendarValue = computed<DateValue | undefined>(() => {
  if (!modelValue.value) {
    return undefined;
  }

  try {
    const dateString = dateToString(modelValue.value);
    return parseDate(dateString);
  } catch {
    return undefined;
  }
});

// Format date in French for display
const displayValue = computed(() => {
  if (!modelValue.value) {
    return props.placeholder;
  }

  try {
    const dateString = dateToString(modelValue.value);
    const d = toDate(dateString);

    return d.toLocaleDateString(props.locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return modelValue.value;
  }
});

const onSelect = (val: DateValue | undefined) => {
  if (!val) {
    return;
  }

  // Emit as plain ISO string YYYY-MM-DD
  modelValue.value = val.toString();
};

function toDate(value: string): Date {
  return parseDate(value).toDate(getLocalTimeZone());
}

function dateToString(date: Date | string): string {
  return typeof date === "string" ? date : date.toISOString();
}
</script>
