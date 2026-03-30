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
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Active Connections</CardTitle>
          <Activity class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">1,204</div>
          <p class="text-xs text-muted-foreground whitespace-nowrap">
            <span class="text-emerald-500 font-medium">+15%</span> from last
            hour
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Total Apps</CardTitle>
          <Boxes class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">12</div>
          <p class="text-xs text-muted-foreground whitespace-nowrap">
            <span class="text-emerald-500 font-medium">+2</span> created this
            month
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Messages Sent</CardTitle>
          <MessageSquare class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">45.2K</div>
          <p class="text-xs text-muted-foreground whitespace-nowrap">
            <span class="text-emerald-500 font-medium">+12.5%</span> from
            yesterday
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader
          class="flex flex-row items-center justify-between pb-2 space-y-0"
        >
          <CardTitle class="text-sm font-medium">Server Load</CardTitle>
          <Server class="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">34%</div>
          <p class="text-xs text-muted-foreground whitespace-nowrap">
            Stable & Healthy
          </p>
        </CardContent>
      </Card>
    </div>

    <!-- Charts and Recent Apps -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="lg:col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>
            Connection activity over the last 30 days.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            class="h-75 flex flex-col items-center justify-center bg-muted/30 border border-dashed rounded-lg transition-colors hover:bg-muted/50"
          >
            <ChartColumn class="w-10 h-10 text-muted-foreground mb-4" />
            <span class="text-muted-foreground text-sm font-medium">
              Activity Chart Visualization
            </span>
            <span class="text-muted-foreground/70 text-xs">
              Waiting for live data
            </span>
          </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-3">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Your recently active Soketi apps.</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="space-y-6">
            <div v-for="i in 5" :key="i" class="flex items-center group">
              <div
                class="w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              >
                <Box class="w-5 h-5" />
              </div>
              <div class="ml-4 space-y-1 overflow-hidden">
                <p class="text-sm font-medium leading-none truncate pr-2">
                  Production App {{ i }}
                </p>
                <p class="text-xs text-muted-foreground truncate pr-2">
                  ID: skt_app_1a2b{{ i }}c3d
                </p>
              </div>
              <div class="ml-auto font-medium shrink-0">
                <Badge
                  :variant="i === 5 ? 'outline' : 'default'"
                  :class="
                    i !== 5
                      ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none'
                      : ''
                  "
                >
                  {{ i === 5 ? "Inactive" : "Active" }}
                </Badge>
              </div>
            </div>
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

import type { Application } from "#shared/types";
import PageHero from "@/components/PageHero.vue";
import CreateApplicationModal from "@/components/modals/applications/CreateApplicationModal.vue";

useHead({ title: "Dashboard" });

function handleCreatedApplication(app?: Application) {
  navigateTo(`/applications`);
}
</script>
