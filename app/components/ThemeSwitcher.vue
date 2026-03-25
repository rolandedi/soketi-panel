<template>
  <DropdownMenuSub>
    <DropdownMenuSubTrigger>
      <LucidePalette class="size-4 opacity-60" aria-hidden="true" />
      <span>Theme</span>
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent class="min-w-32">
        <DropdownMenuItem @click="colorMode.preference = 'light'">
          <LucideSun class="mr-2 size-4 opacity-60" />
          <span>Light</span>
          <LucideCheck
            v-if="colorMode.preference === 'light'"
            class="ml-auto size-4"
          />
        </DropdownMenuItem>
        <DropdownMenuItem @click="colorMode.preference = 'dark'">
          <LucideMoon class="mr-2 size-4 opacity-60" />
          <span>Dark</span>
          <LucideCheck
            v-if="colorMode.preference === 'dark'"
            class="ml-auto size-4"
          />
        </DropdownMenuItem>
        <DropdownMenuItem @click="colorMode.preference = 'system'">
          <LucideMonitor class="mr-2 size-4 opacity-60" />
          <span>System</span>
          <LucideCheck
            v-if="colorMode.preference === 'system'"
            class="ml-auto size-4"
          />
        </DropdownMenuItem>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>

<script lang="ts" setup>
import {
  LucideCheck,
  LucideMonitor,
  LucideMoon,
  LucidePalette,
  LucideSun,
} from "lucide-vue-next";

import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

const colorMode = useColorMode();
</script>
