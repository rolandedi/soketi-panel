<template>
  <div class="space-y-8">
    <PageHero title="About" description="Learn more about Soketi Panel." />

    <!-- Description -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Info class="w-5 h-5 text-muted-foreground" />
          What is Soketi Panel?
        </CardTitle>
        <CardDescription>
          A modern administration interface for Soketi WebSocket server.
        </CardDescription>
      </CardHeader>
      <CardContent
        class="space-y-4 text-sm leading-relaxed text-muted-foreground"
      >
        <p>
          Soketi Panel is a web-based administration interface for managing the
          <a
            href="https://soketi.app/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary underline underline-offset-4 hover:text-primary/80"
          >
            Soketi
          </a>
          WebSocket server. It provides a clean, intuitive dashboard to create
          and manage applications, monitor active connections, and test
          WebSocket events in real-time.
        </p>
        <p>
          Designed for developers and system administrators, Soketi Panel
          simplifies the operational overhead of running a self-hosted Pusher
          protocol-compatible server. Whether you are managing a single Laravel
          application or orchestrating multiple services, Soketi Panel gives you
          the visibility and control you need.
        </p>
      </CardContent>
    </Card>

    <!-- Features -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Sparkles class="w-5 h-5 text-muted-foreground" />
          Key Features
        </CardTitle>
        <CardDescription>
          Everything you need to manage your WebSocket infrastructure.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="grid gap-4 sm:grid-cols-2">
          <div class="flex items-start gap-3">
            <div
              class="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2 text-primary"
            >
              <AppWindow class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-sm font-medium">Application Management</h4>
              <p class="text-xs text-muted-foreground">
                Create, edit, and delete Soketi applications with secure key
                generation.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2 text-primary"
            >
              <Play class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-sm font-medium">WebSocket Playground</h4>
              <p class="text-xs text-muted-foreground">
                Interactive console to test connections, subscribe to channels,
                and emit events.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2 text-primary"
            >
              <BarChart3 class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-sm font-medium">Dashboard & Monitoring</h4>
              <p class="text-xs text-muted-foreground">
                Real-time statistics, connection tracking, and server health
                overview.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2 text-primary"
            >
              <BookOpenText class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-sm font-medium">In-App Documentation</h4>
              <p class="text-xs text-muted-foreground">
                Quick guides for configuring your WebSocket clients and servers.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2 text-primary"
            >
              <Palette class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-sm font-medium">Dark Mode</h4>
              <p class="text-xs text-muted-foreground">
                Full light and dark theme support with system preference
                detection.
              </p>
            </div>
          </div>
          <div class="flex items-start gap-3">
            <div
              class="flex shrink-0 items-center justify-center rounded-lg bg-primary/10 p-2 text-primary"
            >
              <ShieldCheckIcon class="w-4 h-4" />
            </div>
            <div>
              <h4 class="text-sm font-medium">Role-Based Access</h4>
              <p class="text-xs text-muted-foreground">
                Secure authentication with administrator role management via
                Better Auth.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Tech Stack -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Code class="w-5 h-5 text-muted-foreground" />
          Built With
        </CardTitle>
        <CardDescription>
          A modern, type-safe stack for reliability and developer experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="flex flex-wrap gap-2">
          <Badge variant="secondary">Nuxt 4</Badge>
          <Badge variant="secondary">Vue 3</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Tailwind CSS v4</Badge>
          <Badge variant="secondary">Shadcn Vue</Badge>
          <Badge variant="secondary">Better Auth</Badge>
          <Badge variant="secondary">Knex.js</Badge>
          <Badge variant="secondary">Zod</Badge>
          <Badge variant="secondary">TanStack Table</Badge>
        </div>
      </CardContent>
    </Card>

    <!-- License -->
    <Card>
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <Scale class="w-5 h-5 text-muted-foreground" />
          License
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-sm text-muted-foreground">
          Soketi Panel is open-source software distributed under the
          <span class="font-medium text-foreground">GPL-3.0</span> license. You
          are free to use, modify, and distribute it in accordance with the
          terms of the license.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {
  Info,
  Sparkles,
  AppWindow,
  Play,
  BarChart3,
  BookOpenText,
  Palette,
  ShieldCheckIcon,
  Code,
  Scale,
} from "lucide-vue-next";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import PageHero from "@/components/PageHero.vue";

useHead({ title: "About" });
</script>
