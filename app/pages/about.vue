<template>
  <div class="space-y-6">
    <PageHero title="About" description="Learn more about Soketi Panel." />

    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>Learn more about Soketi Panel.</CardDescription>
      </CardHeader>
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
