<template>
  <div class="space-y-8">
    <PageHero
      title="Playground"
      description="Test your Soketi server and applications."
    />

    <div class="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)]">
      <Card>
        <CardHeader>
          <CardTitle class="text-base font-semibold">
            Test Event Broadcasting
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-2">
            <Label for="application">
              Application to send<span class="text-destructive">*</span>
            </Label>
            <Select v-model="selectedApplicationId">
              <SelectTrigger id="application" class="w-full">
                <SelectValue
                  :placeholder="
                    loadingApplications
                      ? 'Loading applications...'
                      : 'Select an application'
                  "
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="application in applications"
                    :key="application.id"
                    :value="application.id"
                  >
                    {{ application.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <p class="text-xs text-muted-foreground">
              The event will be sent using the selected application's
              credentials.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="space-y-2">
              <Label for="channel">
                Channel name<span class="text-destructive">*</span>
              </Label>
              <Input
                id="channel"
                v-model="channel"
                placeholder="public-notifications"
              />
            </div>
            <div class="space-y-2">
              <Label for="event">
                Event name<span class="text-destructive">*</span>
              </Label>
              <Input
                id="event"
                v-model="eventName"
                placeholder="order.updated"
              />
            </div>
          </div>

          <div class="space-y-2">
            <Label for="payload">
              Payload<span class="text-destructive">*</span>
            </Label>
            <JsonEditor v-model="payload" />
            <p class="text-xs text-muted-foreground">
              Payload must be valid JSON. It will be stored in the messages
              history.
            </p>
          </div>

          <div class="flex items-center justify-end gap-3">
            <Button
              class="min-w-36"
              :disabled="isSubmitting || !canSubmit"
              @click="handleSubmit"
            >
              <Loader2 v-if="isSubmitting" class="size-4 animate-spin" />
              <Send v-else class="size-4" />
              {{ isSubmitting ? "Sending..." : "Send Event" }}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card class="border-border/70 shadow-none">
        <CardHeader>
          <CardTitle class="text-base font-semibold">
            Broadcast Details
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4 text-sm">
          <div class="space-y-1">
            <p class="text-muted-foreground">Selected application</p>
            <p class="font-medium text-foreground">
              {{ selectedApplication?.name || "None selected" }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-muted-foreground">Channel</p>
            <p class="font-medium text-foreground">
              {{ channel || "-" }}
            </p>
          </div>

          <div class="space-y-1">
            <p class="text-muted-foreground">Event</p>
            <p class="font-medium text-foreground">
              {{ eventName || "-" }}
            </p>
          </div>

          <div class="space-y-2">
            <p class="text-muted-foreground">Payload preview</p>
            <CodeBlock language="json">{{ prettyPayload }}</CodeBlock>
          </div>

          <div
            v-if="lastResult"
            class="space-y-2 rounded-lg border border-border/70 bg-emerald-500/10 p-4 text-sm"
          >
            <p class="font-medium text-foreground">Last broadcast</p>
            <p class="text-muted-foreground">
              Sent to {{ lastResult.applicationName }} at
              {{ lastResult.sentAt }}
            </p>
            <p class="text-muted-foreground">
              Message ID: {{ lastResult.messageId }}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { Loader2, Send } from "lucide-vue-next";
import { toast } from "vue-sonner";

import type { Application, PaginatedResponse } from "#shared/types";
import { useCsrfFetch } from "@/composables/useCsrfFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import JsonEditor from "@/components/JsonEditor.vue";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import PageHero from "@/components/PageHero.vue";
import CodeBlock from "@/components/CodeBlock.vue";

useHead({ title: "Playground" });

const { csrfFetch } = useCsrfFetch();

const applications = ref<Application[]>([]);
const loadingApplications = ref(false);
const isSubmitting = ref(false);

const selectedApplicationId = ref("");
const channel = ref("");
const eventName = ref("");
const payload = ref(`{
  "message": "Hello from Soketi",
  "severity": "info"
}`);

const lastResult = ref<null | {
  applicationName: string;
  messageId: string;
  sentAt: string;
}>(null);

const selectedApplication = computed(() => {
  return (
    applications.value.find(
      (application) => application.id === selectedApplicationId.value,
    ) ?? null
  );
});

const prettyPayload = computed(() => {
  try {
    return JSON.stringify(JSON.parse(payload.value || "{}"), null, 2);
  } catch {
    return payload.value;
  }
});

const canSubmit = computed(() =>
  Boolean(
    selectedApplicationId.value &&
    channel.value.trim() &&
    eventName.value.trim() &&
    payload.value.trim(),
  ),
);

onMounted(() => {
  void handleFetchApplications();
});

async function handleFetchApplications() {
  loadingApplications.value = true;

  try {
    const response = await $fetch<PaginatedResponse<Application>>(
      "/api/applications",
      {
        params: {
          limit: 100,
        },
      },
    );

    applications.value = response.data;

    if (!selectedApplicationId.value && response.data.length > 0) {
      selectedApplicationId.value = response.data[0]?.id || "";
    }
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || "Failed to fetch applications");
  } finally {
    loadingApplications.value = false;
  }
}

async function handleSubmit() {
  if (!canSubmit.value || isSubmitting.value) {
    return;
  }

  let parsedPayload: unknown;
  try {
    parsedPayload = JSON.parse(payload.value);
  } catch {
    toast.error("Payload must be valid JSON");
    return;
  }

  isSubmitting.value = true;

  try {
    const response = await csrfFetch<{ id: string; app_id: string }>(
      "/api/playground/broadcast",
      {
        method: "POST",
        body: {
          app_id: selectedApplicationId.value,
          channel: channel.value.trim(),
          event: eventName.value.trim(),
          payload: JSON.stringify(parsedPayload),
        },
      },
    );

    lastResult.value = {
      applicationName: selectedApplication.value?.name || response.app_id,
      messageId: response.id,
      sentAt: new Date().toLocaleString(),
    };

    toast.success("Event sent successfully");
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || "Failed to send event");
  } finally {
    isSubmitting.value = false;
  }
}
</script>
