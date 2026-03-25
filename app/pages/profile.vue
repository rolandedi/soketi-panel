<template>
  <div class="space-y-6">
    <PageHero title="Profile" description="Manage your profile." />

    <Card>
      <CardContent>
        <p>
          Soketi Panel is a web-based interface for managing Soketi, a
          self-hosted WebSocket server for Laravel applications.
        </p>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
useHead({ title: "About" });
</script>
