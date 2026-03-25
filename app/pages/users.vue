<template>
  <div class="space-y-6">
    <PageHero title="Users" description="Manage your Soketi Panel users.">
      <Button><PlusIcon /> New user</Button>
    </PageHero>

    <div class="space-y-4">
      <DataTable :columns="usersColumns" :data="data" filter-column="name" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { PlusIcon } from "lucide-vue-next";

import type { User } from "#shared/types";
import { DataTable } from "~/components/data-table";
import { usersColumns } from "~/components/table-columns/usersColumns";
import PageHero from "~/components/PageHero.vue";

useHead({ title: "Users" });

const data = ref<User[]>([]);

onMounted(async () => {
  // Mock data or fetch from API
  data.value = [
    {
      id: "1",
      name: "Admin",
      email: "admin@email.com",
      location: "Netherlands",
      flag: "🇳🇱",
      status: "Active",
      balance: 1200,
    },
    {
      id: "2",
      name: "Roland Edi",
      email: "roland@email.com",
      location: "Ivory Coast",
      flag: "🇨🇮",
      status: "Active",
      balance: 450,
    },
    {
      id: "3",
      name: "John Doe",
      email: "john@example.com",
      location: "United States",
      flag: "🇺🇸",
      status: "Inactive",
      balance: 0,
    },
    {
      id: "4",
      name: "Jane Smith",
      email: "jane@example.com",
      location: "United Kingdom",
      flag: "🇬🇧",
      status: "Pending",
      balance: 230,
    },
  ];
});
</script>
