<template>
  <div class="min-h-screen bg-muted/40 flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <div class="flex items-center gap-2 font-bold text-xl mb-6 justify-center">
        <Server class="w-6 h-6 text-primary" />
        Soketi Panel
      </div>
      
      <slot />
      
      <div class="text-center mt-8 text-sm text-muted-foreground/80">
        &copy; {{ new Date().getFullYear() }} Soketi Panel
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Server } from 'lucide-vue-next';
</script>
