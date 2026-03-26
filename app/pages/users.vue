<template>
  <div class="space-y-6">
    <PageHero title="Users" description="Manage your Soketi Panel users.">
      <Button><PlusIcon /> New user</Button>
    </PageHero>

    <div class="space-y-4">
      <DataTable v-model="data" :columns="usersColumns" filter-column="name" />
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

const data = ref<User[]>([]);

onMounted(() => {
  handleFetch();
});

async function handleFetch() {
  const { data: users } = await useFetch<User[]>("/api/users");
  console.log(users.value);

  setTimeout(() => {
    data.value = users.value || [];
  }, 1000);
}
</script>
