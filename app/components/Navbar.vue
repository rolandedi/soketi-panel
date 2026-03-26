<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 md:px-6"
  >
    <div
      class="flex h-16 items-center justify-between gap-4 max-w-6xl mx-auto px-4 md:px-6"
    >
      <!-- Left side -->
      <div class="flex flex-1 items-center gap-2">
        <!-- Mobile menu trigger -->
        <Popover>
          <PopoverTrigger as-child>
            <Button class="group size-8 md:hidden" variant="ghost" size="icon">
              <svg
                class="pointer-events-none"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 12L20 12"
                  class="origin-center -translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-x-0 group-aria-expanded:translate-y-0 group-aria-expanded:rotate-315"
                />
                <path
                  d="M4 12H20"
                  class="origin-center transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.8)] group-aria-expanded:rotate-45"
                />
                <path
                  d="M4 12H20"
                  class="origin-center translate-y-1.75 transition-all duration-300 ease-[cubic-bezier(.5,.85,.25,1.1)] group-aria-expanded:translate-y-0 group-aria-expanded:rotate-135"
                />
              </svg>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" class="w-36 p-1 md:hidden">
            <NavigationMenu class="max-w-none *:w-full">
              <NavigationMenuList class="flex-col items-start gap-0 md:gap-2">
                <NavigationMenuItem
                  v-for="(link, index) in menuItems"
                  :key="index"
                  class="w-full"
                >
                  <NavigationMenuLink
                    as-child
                    class="flex-row items-center gap-2 py-1.5"
                    :active="link.active"
                  >
                    <NuxtLink :to="link.href">
                      <component
                        :is="link.icon"
                        :size="16"
                        aria-hidden="true"
                      />
                      <span>{{ link.label }}</span>
                    </NuxtLink>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>
        <!-- Logo -->
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center gap-2">
            <img src="/logo.png" alt="Soketi Panel" class="size-8" />
            <span class="text-xl font-bold">Soketi Panel</span>
          </NuxtLink>
        </div>
      </div>
      <!-- Middle area -->
      <NavigationMenu class="max-md:hidden">
        <NavigationMenuList class="gap-2">
          <template v-for="(item, index) in menuItems" :key="index">
            <NavigationMenuItem v-if="!item.children">
              <NavigationMenuLink
                :active="item.active"
                as-child
                class="flex-row items-center gap-2 py-1.5 font-medium text-foreground hover:bg-primary/10 hover:text-primary dark:hover:bg-primary/10 dark:hover:text-primary"
              >
                <NuxtLink :to="item.href">
                  <component :is="item.icon" :size="16" aria-hidden="true" />
                  <span class="text-nowrap">{{ item.label }}</span>
                </NuxtLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem v-else>
              <NavigationMenuTrigger
                class="hover:text-primary data-[state=open]:text-primary"
                :class="item.active ? 'text-primary' : ''"
              >
                {{ item.label }}
              </NavigationMenuTrigger>
              <NavigationMenuContent align="end">
                <ul class="grid w-50 gap-4">
                  <li>
                    <NavigationMenuLink
                      v-for="(child, idx) in item.children"
                      :key="idx"
                      as-child
                      :active="child.active"
                    >
                      <NuxtLink
                        :to="child.href"
                        class="flex-row items-center gap-2"
                      >
                        {{ child.label }}
                      </NuxtLink>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </template>
        </NavigationMenuList>
      </NavigationMenu>
      <!-- Right side -->
      <div class="flex flex-1 items-center justify-end gap-2">
        <UserMenu />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import {
  LayoutDashboard,
  AppWindow,
  Play,
  BookOpen,
  Users,
  type LucideIcon,
} from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface MenuItem {
  href: string;
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  children?: MenuItem[];
}

const route = useRoute();

const menuItems = computed<MenuItem[]>(() => [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    active: route.path === "/",
  },
  {
    href: "/applications",
    label: "Applications",
    icon: AppWindow,
    active: route.path === "/applications",
  },
  {
    href: "/users",
    label: "Users",
    icon: Users,
    active: route.path === "/users",
  },
  {
    href: "/playground",
    label: "Playground",
    icon: Play,
    active: route.path === "/playground",
  },
  {
    href: "#",
    label: "Documentation",
    icon: BookOpen,
    active: route.path.startsWith("/docs/"),
    children: [
      {
        href: "/docs/client",
        label: "Client configuration",
        active: route.path === "/docs/client",
      },
      {
        href: "/docs/server",
        label: "Server configuration",
        active: route.path === "/docs/server",
      },
    ],
  },
]);
</script>
