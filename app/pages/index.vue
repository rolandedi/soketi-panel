<template>
  <div class="space-y-6">
    <!-- Header -->
    <PageHero
      title="Dashboard"
      description="Overview of your Soketi server and applications."
    >
      <CreateApplicationModal @success="handleCreatedApplication">
        <Button><Plus /> Create application</Button>
      </CreateApplicationModal>
    </PageHero>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <!-- Active Connections -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Active Connections</CardTitle>
          <Activity class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton v-if="statsLoading" class="h-8 w-24 mb-1" />
          <template v-else>
            <div class="text-2xl font-bold">
              {{
                stats?.connections !== null && stats?.connections !== undefined
                  ? stats.connections.toLocaleString()
                  : "N/A"
              }}
            </div>
            <p class="text-xs text-muted-foreground whitespace-nowrap">
              <span
                :class="
                  stats?.serverStatus === 'ok'
                    ? 'text-emerald-500'
                    : 'text-muted-foreground'
                "
                class="font-medium"
              >
                {{
                  stats?.serverStatus === "ok"
                    ? "Server reachable"
                    : "Server unreachable"
                }}
              </span>
            </p>
          </template>
        </CardContent>
      </Card>

      <!-- Total Apps -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Total Apps</CardTitle>
          <Boxes class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton v-if="statsLoading" class="h-8 w-16 mb-1" />
          <template v-else>
            <div class="text-2xl font-bold">{{ stats?.apps.total ?? 0 }}</div>
            <p class="text-xs text-muted-foreground whitespace-nowrap">
              <span class="text-emerald-500 font-medium"
                >{{ stats?.apps.enabled ?? 0 }} enabled</span
              >
              &middot; {{ stats?.apps.disabled ?? 0 }} disabled
            </p>
          </template>
        </CardContent>
      </Card>

      <!-- Messages Sent -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Messages Sent</CardTitle>
          <MessageSquare class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton v-if="statsLoading" class="h-8 w-20 mb-1" />
          <template v-else>
            <div class="text-2xl font-bold">
              {{ formatCount(stats?.messages.total ?? 0) }}
            </div>
            <p class="text-xs text-muted-foreground whitespace-nowrap">
              <template
                v-if="
                  stats?.messages.trendPercent !== null &&
                  stats?.messages.trendPercent !== undefined
                "
              >
                <span
                  :class="
                    stats.messages.trendPercent >= 0
                      ? 'text-emerald-500'
                      : 'text-red-500'
                  "
                  class="font-medium"
                >
                  {{ stats.messages.trendPercent >= 0 ? "+" : ""
                  }}{{ stats.messages.trendPercent }}%
                </span>
                vs yesterday
              </template>
              <template v-else>
                {{ stats?.messages.today ?? 0 }} today
              </template>
            </p>
          </template>
        </CardContent>
      </Card>

      <!-- Server Status -->
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Server Status</CardTitle>
          <Server class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <Skeleton v-if="statsLoading" class="h-8 w-28 mb-1" />
          <template v-else>
            <div class="text-2xl font-bold">
              {{ stats?.serverStatus === "ok" ? "Online" : "Offline" }}
            </div>
            <p class="text-xs text-muted-foreground whitespace-nowrap">
              <span
                :class="
                  stats?.serverStatus === 'ok'
                    ? 'text-emerald-500'
                    : 'text-red-500'
                "
                class="font-medium"
              >
                {{
                  stats?.serverStatus === "ok"
                    ? "Soketi metrics OK"
                    : "Cannot reach Soketi"
                }}
              </span>
            </p>
          </template>
        </CardContent>
      </Card>
    </div>

    <!-- Charts and Recent Apps -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="lg:col-span-4">
        <CardHeader>
          <CardTitle>Active Connections</CardTitle>
          <CardDescription>
            Peak connections per day over the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton v-if="chartLoading" class="h-75 w-full rounded-lg" />
          <template v-else-if="hasChartData">
            <ChartContainer :config="chartConfig" class="h-75">
              <VisXYContainer
                :data="chartData"
                :margin="{ top: 8, right: 8, bottom: 24, left: 40 }"
              >
                <VisArea
                  :x="(d: ChartEntry, i: number) => i"
                  :y="(d: ChartEntry) => d.connections"
                  color="hsl(var(--primary))"
                  :opacity="0.15"
                />
                <VisLine
                  :x="(d: ChartEntry, i: number) => i"
                  :y="(d: ChartEntry) => d.connections"
                  color="hsl(var(--primary))"
                />
                <VisAxis
                  type="x"
                  :tick-format="(i: number) => chartLabels[i] ?? ''"
                  :num-ticks="6"
                />
                <VisAxis type="y" />
                <VisCrosshair
                  color="hsl(var(--primary))"
                  :template="
                    (d: ChartEntry) => (d ? `${d.date}: ${d.connections}` : '')
                  "
                />
                <VisTooltip />
              </VisXYContainer>
            </ChartContainer>
          </template>
          <div
            v-else
            class="h-75 flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg transition-colors hover:bg-muted/50"
          >
            <ChartColumn class="w-10 h-10 text-muted-foreground mb-4" />
            <span class="text-muted-foreground text-sm font-medium">
              No connection data yet
            </span>
            <span class="text-muted-foreground/70 text-xs">
              Data will appear once Soketi is reachable
            </span>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription
            >Your most recently created Soketi apps.</CardDescription
          >
        </CardHeader>
        <CardContent>
          <div v-if="statsLoading" class="space-y-6">
            <div v-for="i in 5" :key="i" class="flex items-center gap-4">
              <Skeleton class="w-10 h-10 rounded-xl shrink-0" />
              <div class="flex-1 space-y-1.5">
                <Skeleton class="h-4 w-3/4" />
                <Skeleton class="h-3 w-1/2" />
              </div>
              <Skeleton class="h-6 w-16 rounded-full" />
            </div>
          </div>
          <div v-else-if="stats?.recentApps.length" class="space-y-6">
            <div
              v-for="app in stats.recentApps"
              :key="app.id"
              class="flex items-center group"
            >
              <div
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0"
              >
                <Box class="w-5 h-5" />
              </div>
              <div class="ml-4 space-y-1 overflow-hidden">
                <p class="text-sm font-medium leading-none truncate pr-2">
                  {{ app.name }}
                </p>
                <p class="text-xs text-muted-foreground truncate pr-2">
                  ID: {{ app.id }}
                </p>
              </div>
              <div class="ml-auto font-medium shrink-0">
                <Badge
                  :variant="app.enabled ? 'default' : 'outline'"
                  :class="
                    app.enabled
                      ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none'
                      : ''
                  "
                >
                  {{ app.enabled ? "Active" : "Inactive" }}
                </Badge>
              </div>
            </div>
          </div>
          <div
            v-else
            class="flex flex-col items-center justify-center py-12 text-center"
          >
            <Box class="w-8 h-8 text-muted-foreground mb-3" />
            <p class="text-sm text-muted-foreground">No applications yet</p>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  Activity,
  Plus,
  Boxes,
  MessageSquare,
  Server,
  ChartColumn,
  Box,
} from "lucide-vue-next";
import {
  VisXYContainer,
  VisLine,
  VisArea,
  VisAxis,
  VisCrosshair,
  VisTooltip,
} from "@unovis/vue";
import { ChartContainer } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

import type { Application } from "#shared/types";
import PageHero from "@/components/PageHero.vue";
import CreateApplicationModal from "@/components/modals/applications/CreateApplicationModal.vue";

useHead({ title: "Dashboard" });

// ── Types ─────────────────────────────────────────────────────────────────────

interface DashboardStats {
  apps: { total: number; enabled: number; disabled: number };
  messages: {
    total: number;
    today: number;
    yesterday: number;
    trendPercent: number | null;
  };
  connections: number | null;
  serverStatus: "ok" | "unreachable";
  recentApps: { id: string; name: string; enabled: boolean }[];
}

interface ChartEntry {
  date: string;
  connections: number;
}

// ── Data fetching ─────────────────────────────────────────────────────────────

const { data: stats, pending: statsLoading } = await useFetch<DashboardStats>(
  "/api/dashboard/stats",
);

const { data: chartRaw, pending: chartLoading } = await useFetch<{
  data: ChartEntry[];
}>("/api/dashboard/chart");

// ── Chart helpers ─────────────────────────────────────────────────────────────

const chartData = computed<ChartEntry[]>(() => chartRaw.value?.data ?? []);

const hasChartData = computed(() =>
  chartData.value.some((d) => d.connections > 0),
);

const chartLabels = computed(() =>
  chartData.value.map((d) => {
    const [, month, day] = d.date.split("-");
    return `${day}/${month}`;
  }),
);

const chartConfig = {
  connections: { label: "Connections", color: "hsl(var(--primary))" },
};

// ── Formatters ────────────────────────────────────────────────────────────────

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

// ── Handlers ──────────────────────────────────────────────────────────────────

function handleCreatedApplication(_app?: Application) {
  navigateTo("/applications");
}
</script>
