<template>
  <div class="space-y-8">
    <PageHero
      title="Settings"
      description="Manage your Soketi Panel settings."
    />

    <Tabs default-value="general">
      <TabsList class="mb-4">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="server">Server</TabsTrigger>
      </TabsList>

      <!-- General Tab -->
      <TabsContent value="general">
        <Card>
          <CardHeader class="border-b">
            <CardTitle>Default Application Settings</CardTitle>
            <CardDescription>
              These values are applied as defaults when creating new
              applications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div v-if="isSettingsLoading" class="text-sm text-muted-foreground">
              Loading settings...
            </div>

            <form v-else class="space-y-6" @submit.prevent="onSaveSettings">
              <FieldGroup class="gap-5">
                <!-- Numeric fields -->
                <div class="grid gap-4 md:grid-cols-2">
                  <Field>
                    <FieldLabel for="max-connections">
                      Max connections
                    </FieldLabel>
                    <Input
                      id="max-connections"
                      v-model="form.default_app_max_connections"
                      type="number"
                      :disabled="isSaving"
                    />
                    <FieldDescription>-1 means unlimited.</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel for="max-backend-events">
                      Max backend events/sec
                    </FieldLabel>
                    <Input
                      id="max-backend-events"
                      v-model="form.default_app_max_backend_events_per_sec"
                      type="number"
                      :disabled="isSaving"
                    />
                    <FieldDescription>-1 means unlimited.</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel for="max-client-events">
                      Max client events/sec
                    </FieldLabel>
                    <Input
                      id="max-client-events"
                      v-model="form.default_app_max_client_events_per_sec"
                      type="number"
                      :disabled="isSaving"
                    />
                    <FieldDescription>-1 means unlimited.</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel for="max-read-req">
                      Max read requests/sec
                    </FieldLabel>
                    <Input
                      id="max-read-req"
                      v-model="form.default_app_max_read_req_per_sec"
                      type="number"
                      :disabled="isSaving"
                    />
                    <FieldDescription>-1 means unlimited.</FieldDescription>
                  </Field>

                  <Field>
                    <FieldLabel for="max-presence-members">
                      Max presence members/channel
                    </FieldLabel>
                    <Input
                      id="max-presence-members"
                      v-model="
                        form.default_app_max_presence_members_per_channel
                      "
                      type="number"
                      :disabled="isSaving"
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="max-presence-member-size">
                      Max presence member size (KB)
                    </FieldLabel>
                    <Input
                      id="max-presence-member-size"
                      v-model="form.default_app_max_presence_member_size_in_kb"
                      type="number"
                      :disabled="isSaving"
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="max-channel-name-length">
                      Max channel name length
                    </FieldLabel>
                    <Input
                      id="max-channel-name-length"
                      v-model="form.default_app_max_channel_name_length"
                      type="number"
                      :disabled="isSaving"
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="max-event-channels">
                      Max event channels at once
                    </FieldLabel>
                    <Input
                      id="max-event-channels"
                      v-model="form.default_app_max_event_channels_at_once"
                      type="number"
                      :disabled="isSaving"
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="max-event-name-length">
                      Max event name length
                    </FieldLabel>
                    <Input
                      id="max-event-name-length"
                      v-model="form.default_app_max_event_name_length"
                      type="number"
                      :disabled="isSaving"
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="max-event-payload">
                      Max event payload (KB)
                    </FieldLabel>
                    <Input
                      id="max-event-payload"
                      v-model="form.default_app_max_event_payload_in_kb"
                      type="number"
                      :disabled="isSaving"
                    />
                  </Field>

                  <Field>
                    <FieldLabel for="max-event-batch-size">
                      Max event batch size
                    </FieldLabel>
                    <Input
                      id="max-event-batch-size"
                      v-model="form.default_app_max_event_batch_size"
                      type="number"
                      :disabled="isSaving"
                    />
                  </Field>
                </div>

                <!-- Boolean fields -->
                <div class="grid gap-4 md:grid-cols-2">
                  <Field
                    class="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div class="space-y-1">
                      <FieldLabel for="enable-client-messages">
                        Client messages
                      </FieldLabel>
                      <FieldDescription>
                        Allow clients to send events by default.
                      </FieldDescription>
                    </div>
                    <div>
                      <Switch
                        id="enable-client-messages"
                        v-model="enableClientMessages"
                        :disabled="isSaving"
                      />
                    </div>
                  </Field>

                  <Field
                    class="flex items-center justify-between rounded-lg border p-3"
                  >
                    <div class="space-y-1">
                      <FieldLabel for="enable-user-auth">
                        User authentication
                      </FieldLabel>
                      <FieldDescription>
                        Enable user authentication by default.
                      </FieldDescription>
                    </div>
                    <div>
                      <Switch
                        id="enable-user-auth"
                        v-model="enableUserAuth"
                        :disabled="isSaving"
                      />
                    </div>
                  </Field>
                </div>

                <div class="flex justify-end pt-2">
                  <Button type="submit" :disabled="isSaving">
                    <Loader2Icon
                      v-if="isSaving"
                      class="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                    Save changes
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <!-- Server Tab -->
      <TabsContent value="server" class="space-y-4">
        <div v-if="isServerLoading" class="text-sm text-muted-foreground">
          Loading server info...
        </div>

        <template v-else-if="serverInfo">
          <!-- Connection -->
          <Card>
            <CardHeader class="border-b">
              <CardTitle>Connection</CardTitle>
              <CardDescription>
                Soketi server and metrics endpoint configuration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl class="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt class="text-sm text-muted-foreground">Soketi host</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.soketi.host }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted-foreground">Soketi port</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.soketi.port }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted-foreground">Metrics host</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.metrics.host }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted-foreground">Metrics port</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.metrics.port }}
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-sm text-muted-foreground">Redis URL</dt>
                  <dd class="mt-1 font-mono text-sm break-all">
                    {{ serverInfo.redis.url }}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <!-- Pusher -->
          <Card>
            <CardHeader class="border-b">
              <CardTitle>Pusher</CardTitle>
              <CardDescription>
                Pusher-compatible client connection details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl class="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt class="text-sm text-muted-foreground">Host</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.pusher.host }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted-foreground">Port</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.pusher.port }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted-foreground">Scheme</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.pusher.scheme }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted-foreground">TLS</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.pusher.tls ? "Enabled" : "Disabled" }}
                  </dd>
                </div>
                <div v-if="serverInfo.pusher.cluster">
                  <dt class="text-sm text-muted-foreground">Cluster</dt>
                  <dd class="mt-1 font-mono text-sm">
                    {{ serverInfo.pusher.cluster }}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <!-- Status -->
          <Card>
            <CardHeader class="border-b">
              <CardTitle>Status</CardTitle>
              <CardDescription>
                Live server metrics and connection status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <dl class="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt class="text-sm text-muted-foreground">Server status</dt>
                  <dd class="mt-1">
                    <Badge
                      :variant="
                        serverInfo.status.serverStatus === 'ok'
                          ? 'default'
                          : 'destructive'
                      "
                    >
                      {{
                        serverInfo.status.serverStatus === "ok"
                          ? "Online"
                          : "Unreachable"
                      }}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt class="text-sm text-muted-foreground">
                    Connected sockets
                  </dt>
                  <dd class="mt-1 text-sm font-semibold">
                    {{
                      serverInfo.status.connectedSockets !== null
                        ? serverInfo.status.connectedSockets
                        : "—"
                    }}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </template>
      </TabsContent>
    </Tabs>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted } from "vue";
import { toast } from "vue-sonner";
import { Loader2Icon } from "lucide-vue-next";

import PageHero from "@/components/PageHero.vue";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCsrfFetch } from "@/composables/useCsrfFetch";

definePageMeta({ middleware: ["admin"] });
useHead({ title: "Settings" });

// ---------- Reactive state ----------

const isSettingsLoading = ref(true);
const isSaving = ref(false);
const isServerLoading = ref(true);

const form = reactive<Record<string, string>>({
  default_app_max_connections: "-1",
  default_app_max_backend_events_per_sec: "-1",
  default_app_max_client_events_per_sec: "-1",
  default_app_max_read_req_per_sec: "-1",
  default_app_max_presence_members_per_channel: "100",
  default_app_max_presence_member_size_in_kb: "10",
  default_app_max_channel_name_length: "100",
  default_app_max_event_channels_at_once: "100",
  default_app_max_event_name_length: "100",
  default_app_max_event_payload_in_kb: "100",
  default_app_max_event_batch_size: "10",
  default_app_enable_client_messages: "true",
  default_app_enable_user_authentication: "false",
});

const enableClientMessages = computed({
  get: () => form.default_app_enable_client_messages === "true",
  set: (val: boolean) => {
    form.default_app_enable_client_messages = val ? "true" : "false";
  },
});

const enableUserAuth = computed({
  get: () => form.default_app_enable_user_authentication === "true",
  set: (val: boolean) => {
    form.default_app_enable_user_authentication = val ? "true" : "false";
  },
});

interface ServerInfo {
  soketi: { host: string; port: string };
  metrics: { host: string; port: string };
  pusher: {
    host: string;
    port: string;
    scheme: string;
    tls: boolean;
    cluster: string | null;
  };
  redis: { url: string };
  status: {
    connectedSockets: number | null;
    serverStatus: "ok" | "unreachable";
  };
}

const serverInfo = ref<ServerInfo | null>(null);

// ---------- Data fetching ----------

async function loadSettings() {
  isSettingsLoading.value = true;
  try {
    const data = await $fetch<Record<string, string | null>>("/api/settings");
    for (const [key, value] of Object.entries(data)) {
      if (value !== null && value !== undefined) {
        form[key] = value;
      }
    }
  } catch {
    toast.error("Failed to load settings");
  } finally {
    isSettingsLoading.value = false;
  }
}

async function loadServerInfo() {
  isServerLoading.value = true;
  try {
    serverInfo.value = await $fetch<ServerInfo>("/api/settings/server");
  } catch {
    toast.error("Failed to load server information");
  } finally {
    isServerLoading.value = false;
  }
}

onMounted(() => {
  loadSettings();
  loadServerInfo();
});

// ---------- Save settings ----------

async function onSaveSettings() {
  isSaving.value = true;
  try {
    const { csrfFetch } = useCsrfFetch();
    await csrfFetch("/api/settings", {
      method: "PUT",
      body: { ...form },
    });
    toast.success("Settings saved successfully");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to save settings");
  } finally {
    isSaving.value = false;
  }
}
</script>
