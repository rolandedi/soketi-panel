<template>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" class="h-auto p-0 hover:bg-transparent">
        <Avatar>
          <AvatarImage src="./avatar.jpg" alt="Profile image" />
          <AvatarFallback>KK</AvatarFallback>
        </Avatar>
        <LucideChevronDown class="size-4 opacity-60" aria-hidden="true" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="max-w-64" align="end">
      <DropdownMenuLabel class="flex min-w-0 flex-col">
        <span class="text-foreground truncate text-sm font-medium">
          Keith Kennedy
        </span>
        <span class="text-muted-foreground truncate text-xs font-normal">
          k.kennedy@originui.com
        </span>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <UserIcon class="size-4 opacity-60" aria-hidden="true" />
          <span>Profile</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <ThemeSwitcher />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem>
        <LucideLogOut class="size-4 opacity-60" aria-hidden="true" />
        <span>Logout</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { LucideChevronDown, LucideLogOut, UserIcon } from "lucide-vue-next";

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
</script>
