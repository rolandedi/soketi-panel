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
        <DropdownMenuItem as-child>
          <NuxtLink to="/profile" class="flex w-full items-center">
            <UserIcon class="size-4" aria-hidden="true" />
            <span>Profile</span>
          </NuxtLink>
        </DropdownMenuItem>
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
import { LucideChevronDown, LucideLogOut, UserIcon } from "lucide-vue-next";

import { getInitials } from "#shared/utils";
import { authClient } from "@/lib/auth-client";
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

const session = authClient.useSession();
const user = computed(() => session.value?.data?.user ?? null);

async function handleLogout() {
  await authClient.signOut();
  navigateTo("/login");
}
</script>
