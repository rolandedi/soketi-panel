<template>
  <div class="space-y-6">
    <PageHero
      title="Server configuration"
      description="Learn more about Soketi Server configuration."
    />

    <Card>
      <CardContent>
        <div
          class="prose prose-sm dark:prose-invert max-w-none"
          v-html="content"
        ></div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
const { data: md } = await useFetch<string>("/api/markdown", {
  query: { path: "server-doc" },
});

const content = computed(() => md.value || "");
</script>
