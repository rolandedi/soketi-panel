<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
  >
    <div
      class="flex h-16 items-center justify-between gap-4 max-w-6xl mx-auto px-4 md:px-6"
    >
      <!-- Left side -->
      <div class="flex items-center gap-2">
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
          <PopoverContent align="start" class="w-48 p-1 md:hidden">
            <nav class="flex flex-col gap-0.5">
              <template v-for="(link, index) in menuItems" :key="index">
                <!-- Item sans enfants -->
                <NuxtLink
                  v-if="!link.children"
                  :to="link.href"
                  class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                  :class="
                    link.active ? 'text-primary font-medium' : 'text-foreground'
                  "
                >
                  <component :is="link.icon" :size="16" aria-hidden="true" />
                  <span>{{ link.label }}</span>
                </NuxtLink>
                <!-- Item avec enfants -->
                <Collapsible v-else>
                  <CollapsibleTrigger
                    class="group flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                    :class="
                      link.active
                        ? 'text-primary font-medium'
                        : 'text-foreground'
                    "
                  >
                    <span class="flex items-center gap-2">
                      <component
                        :is="link.icon"
                        :size="16"
                        aria-hidden="true"
                      />
                      {{ link.label }}
                    </span>
                    <ChevronDown
                      :size="14"
                      class="transition-transform duration-200 group-data-[state=open]:rotate-180"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div class="mt-0.5 flex flex-col gap-0.5 pl-6">
                      <NuxtLink
                        v-for="(child, idx) in link.children"
                        :key="idx"
                        :to="child.href"
                        class="rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                        :class="
                          child.active
                            ? 'text-primary font-medium'
                            : 'text-foreground'
                        "
                      >
                        {{ child.label }}
                      </NuxtLink>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </template>
            </nav>
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
            <template v-if="item.visible !== false">
              <NavigationMenuItem v-if="!item.children">
                <NavigationMenuLink
                  :active="item.active"
                  class="flex-row items-center gap-2 rounded-md font-medium text-foreground hover:bg-primary/10 focus:bg-primary/10 hover:text-primary data-active:focus:bg-primary/10 data-active:hover:bg-primary/10 data-active:bg-primary/10 dark:hover:bg-primary/10 dark:hover:text-primary dark:data-active:hover:bg-primary/20 dark:data-active:bg-primary/20"
                  as-child
                >
                  <NuxtLink :to="item.href">
                    <component :is="item.icon" :size="16" aria-hidden="true" />
                    <span class="text-nowrap">{{ item.label }}</span>
                  </NuxtLink>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem v-else>
                <NavigationMenuTrigger
                  class="flex items-center gap-2 p-2 rounded-md hover:text-primary hover:bg-primary/10 data-active:focus:bg-primary/10 data-active:hover:bg-primary/10 data-active:bg-primary/10 data-[state=open]:text-primary data-[state=open]:bg-primary/10 data-[state=open]:hover:bg-primary/10 dark:data-active:hover:bg-primary/20 dark:data-active:bg-primary/20"
                  :class="item.active ? 'text-primary bg-primary/10' : ''"
                >
                  <component :is="item.icon" :size="16" aria-hidden="true" />
                  <span class="text-nowrap">{{ item.label }}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent align="start" class="w-auto p-2">
                  <ul class="grid w-50 gap-1 p-0">
                    <li v-for="(child, idx) in item.children" :key="idx">
                      <NavigationMenuLink as-child :active="child.active">
                        <NuxtLink
                          :to="child.href"
                          class="flex-row items-center gap-2 hover:bg-primary/10 hover:text-primary rounded-md text-foreground"
                        >
                          {{ child.label }}
                        </NuxtLink>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </template>
          </template>
        </NavigationMenuList>
      </NavigationMenu>

      <!-- Right side -->
      <div class="flex items-center justify-end gap-2">
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
  BookOpenText,
  Users,
  ChevronDown,
  type LucideIcon,
} from "lucide-vue-next";

import { useAuth } from "@/composables/useAuth";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  visible?: boolean;
  children?: MenuItem[];
}

const route = useRoute();
const auth = useAuth();

const user = computed(() => auth.user.value);

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
    visible: auth.isAdmin.value,
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
    icon: BookOpenText,
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
