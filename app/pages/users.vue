<template>
  <div class="space-y-6">
    <PageHero title="Users" description="Manage your Soketi Panel users.">
      <Button><PlusIcon /> New user</Button>
    </PageHero>

    <div class="space-y-4">
      <DataTable
        v-model="data"
        filter-column="name"
        :columns="usersColumns"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { PlusIcon } from "lucide-vue-next";

import type { User } from "#shared/types";
import { usersColumns } from "~/table-columns/usersColumns";
import { DataTable } from "~/components/data-table";
import PageHero from "~/components/PageHero.vue";

useHead({ title: "Users" });

const loading = ref(false);
const data = ref<User[]>([]);

onMounted(() => {
  handleFetch();
});

async function handleFetch() {
  loading.value = true;

  try {
    const users = await $fetch<User[]>("/api/users");
    data.value = users;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>
