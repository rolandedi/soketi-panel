<template>
  <DropdownMenu v-if="user">
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="h-auto p-0 hover:bg-transparent">
        <Avatar>
          <AvatarImage
            v-if="user.image"
            :src="user.image"
            alt="Profile image"
          />
          <AvatarFallback v-else>{{ getInitials(user.name) }}</AvatarFallback>
        </Avatar>
        <LucideChevronDown class="size-4" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="max-w-64" align="end">
      <DropdownMenuLabel class="flex min-w-0 flex-col">
        <span class="text-foreground truncate text-sm font-medium">
          {{ user.name }}
        </span>
        <span class="text-muted-foreground truncate text-xs font-normal">
          {{ user.email }}
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <template v-for="(item, idx) in menuItems" :key="idx">
          <DropdownMenuItem
            v-if="item.visible"
            :data-active="item.active"
            class="focus:bg-primary/10 data-active:focus:bg-primary/10 data-active:hover:bg-primary/10"
            as-child
          >
            <NuxtLink :to="item.href" class="flex items-center w-full">
              <component :is="item.icon" class="size-4" aria-hidden="true" />
              <span>{{ item.label }}</span>
            </NuxtLink>
          </DropdownMenuItem>
        </template>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <ThemeSwitcher />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="handleLogout" class="cursor-pointer">
        <LucideLogOut class="size-4" aria-hidden="true" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import {
  InfoIcon,
  LucideChevronDown,
  LucideLogOut,
  SettingsIcon,
  UserIcon,
} from "lucide-vue-next";

import { getInitials } from "#shared/utils";
import { useAuth } from "@/composables/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const route = useRoute();
const auth = useAuth();

const user = computed(() => auth.user.value);

const menuItems = computed(() => [
  {
    href: "/profile",
    label: "Profile",
    icon: UserIcon,
    active: route.path === "/profile",
    visible: true,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    active: route.path === "/settings",
    visible: auth.isAdmin.value,
  },
  {
    href: "/about",
    label: "About",
    icon: InfoIcon,
    active: route.path === "/about",
    visible: true,
  },
]);

async function handleLogout() {
  await auth.signOut();
  navigateTo("/login");
}
</script>
