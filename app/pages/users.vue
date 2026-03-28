<template>
  <div class="space-y-6">
    <PageHero title="Users" description="Manage your Soketi Panel users.">
      <CreateUserModal @success="handleCreated">
        <Button variant="default"> <PlusIcon /> New user </Button>
      </CreateUserModal>
    </PageHero>

    <div class="space-y-4">
      <DataTable
        ref="tableRef"
        v-model="data"
        search-column="name"
        filter-column="role"
        :filter-options="statuses"
        :columns="columns"
        :loading="loading"
        :left-sticky="true"
        :right-sticky="true"
        @remove:rows="handleDeleteRows"
        @update:pagination="handleFetch"
      />
    </div>

    <EditUserModal
      v-model:open="editModal.open"
      :user="editModal.user"
      @success="handleUpdated"
    />

    <BanUserModal
      v-model:open="banModal.open"
      :user="banModal.user"
      @success="handleUpdated"
    />

    <DeleteUserAlert ref="deleteModal" @confirm:delete="confirmDelete" />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { toast } from "vue-sonner";
import { PlusIcon } from "lucide-vue-next";

import type { PaginatedResponse, User } from "#shared/types";
import { getUsersColumns } from "~/table-columns/usersColumns";
import { DataTable } from "~/components/data-table";
import PageHero from "~/components/PageHero.vue";

import CreateUserModal from "~/components/modals/users/CreateUserModal.vue";
import EditUserModal from "~/components/modals/users/EditUserModal.vue";
import BanUserModal from "~/components/modals/users/BanUserModal.vue";
import DeleteUserAlert from "~/components/modals/users/DeleteUserAlert.vue";

useHead({ title: "Users" });

const statuses = [
  { label: "User", value: "user" },
  { label: "Admin", value: "admin" },
];

const loading = ref(false);
const data = ref<User[]>([]);
const perPage = ref(10);
const currentPage = ref(1);

const editModal = ref<{ open: boolean; user: User | null }>({
  open: false,
  user: null,
});
const banModal = ref<{ open: boolean; user: User | null }>({
  open: false,
  user: null,
});
const deleteModal = useTemplateRef("deleteModal");
const tableRef = useTemplateRef("tableRef");
const table = computed(() => tableRef.value?.table);

const columns = computed(() =>
  getUsersColumns({
    handleEdit: (user) => {
      editModal.value = { open: true, user };
    },
    handleBan: (user) => {
      banModal.value = { open: true, user };
    },
    handleDelete: (user) => {
      deleteModal.value?.present(user);
    },
  }),
);

onMounted(() => {
  handleFetch();
});

async function handleFetch(itemsPerPage?: number, page?: number) {
  loading.value = true;

  perPage.value = itemsPerPage || perPage.value;
  currentPage.value = page || currentPage.value;

  try {
    const res = await $fetch<PaginatedResponse<User>>("/api/users", {
      params: {
        limit: perPage.value,
        page: currentPage.value,
      },
    });

    data.value = res.data;
  } catch (err: any) {
    toast.error(err?.message || "Failed to fetch users");
  } finally {
    loading.value = false;
  }
}

function handleCreated(item: User) {
  data.value.push(item);
  data.value = [...data.value];
}

function handleUpdated(updated: User) {
  const index = data.value.findIndex((u) => u.id === updated.id);

  if (index !== -1) {
    data.value[index] = updated;
  }

  data.value = [...data.value];
}

function handleDeleteRows(items: User[]) {
  console.log(
    "Deleting rows",
    items.map((i) => i.id),
  );
  // TODO: Implement bulk delete API and call it here instead of just filtering out the deleted items from the table
  data.value = data.value.filter((u) => !items.some((i) => i.id === u.id));
  table.value?.resetRowSelection();
}

async function confirmDelete(user: User) {
  data.value = data.value.filter((u) => u.id !== user.id);
  data.value = [...data.value];
  table.value?.resetRowSelection();
}
</script>
