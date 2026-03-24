<template>
  <div class="min-h-screen bg-background text-foreground flex text-sm">
    <!-- Sidebar -->
    <aside class="w-64 border-r border-border bg-sidebar shrink-0 hidden md:block">
      <div class="h-16 flex items-center px-4 border-b border-sidebar-border gap-2 font-semibold">
        <Server class="w-5 h-5 text-primary" />
        <span>Soketi Panel</span>
      </div>
      <nav class="p-4 space-y-1">
        <NuxtLink v-for="link in links" :key="link.to" :to="link.to" 
                  class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sidebar-foreground transition-colors"
                  active-class="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
          <component :is="link.icon" class="w-4 h-4" />
          {{ link.label }}
        </NuxtLink>
      </nav>
    </aside>

    <!-- Main View -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Top header -->
      <header class="h-16 border-b border-border bg-background flex items-center justify-between px-4">
        <div class="flex items-center md:hidden font-semibold gap-2">
           <Server class="w-5 h-5 text-primary" />
           <span>Soketi Panel</span>
        </div>
        <div class="flex-1"></div>
        <div class="flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <UserCircle class="w-5 h-5" />
          </Button>
        </div>
      </header>
      
      <!-- Content Area -->
      <main class="flex-1 overflow-x-hidden overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LayoutDashboard, AppWindow, Play, BookOpen, Users, Server, UserCircle } from "lucide-vue-next";

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/applications', label: 'Applications', icon: AppWindow },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/playground', label: 'Playground', icon: Play },
  { to: '/docs/client', label: 'Client Docs', icon: BookOpen },
];
</script>
