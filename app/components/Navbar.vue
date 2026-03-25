<template>
  <header class="border-b px-4 md:px-6">
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
                    :href="link.href"
                    class="flex-row items-center gap-2 py-1.5"
                    :active="link.active"
                  >
                    <component
                      :is="link.icon"
                      :size="16"
                      class="text-muted-foreground/80"
                      aria-hidden="true"
                    />
                    <span>{{ link.label }}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </PopoverContent>
        </Popover>
        <!-- Logo -->
        <div class="flex items-center">
          <a href="#" class="flex items-center gap-2">
            <img src="/logo.png" alt="Soketi Panel" class="size-8" />
            <span class="text-xl font-bold">Soketi Panel</span>
          </a>
        </div>
      </div>
      <!-- Middle area -->
      <NavigationMenu class="max-md:hidden">
        <NavigationMenuList class="gap-2">
          <template v-for="(item, index) in menuItems" :key="index">
            <NavigationMenuItem v-if="!item.children">
              <NavigationMenuLink
                :active="item.active"
                :href="item.href"
                class="text-foreground hover:text-primary flex-row items-center gap-2 py-1.5 font-medium"
              >
                <component
                  :is="item.icon"
                  :size="16"
                  class="text-muted-foreground/80"
                  aria-hidden="true"
                />
                <span class="text-nowrap">{{ item.label }}</span>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem v-else>
              <NavigationMenuTrigger>{{ item.label }}</NavigationMenuTrigger>
              <NavigationMenuContent align="end">
                <ul class="grid w-50 gap-4">
                  <li>
                    <NavigationMenuLink
                      v-for="(child, idx) in item.children"
                      :key="idx"
                      as-child
                    >
                      <a :href="child.href" class="flex-row items-center gap-2">
                        {{ child.label }}
                      </a>
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

const menuItems: MenuItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: AppWindow },
  { href: "/users", label: "Users", icon: Users },
  { href: "/playground", label: "Playground", icon: Play },
  {
    href: "#",
    label: "Documentation",
    icon: BookOpen,
    children: [
      { href: "/docs/client", label: "Client configuration" },
      { href: "/docs/server", label: "Server configuration" },
    ],
  },
];
</script>
