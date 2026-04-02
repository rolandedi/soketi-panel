<template>
  <div class="space-y-8">
    <PageHero title="Users" description="Manage your Soketi Panel users.">
      <CreateUserModal @success="handleCreated">
        <Button variant="default" :disabled="loading">
          <PlusIcon /> New user
        </Button>
      </CreateUserModal>
    </PageHero>

    <div class="space-y-4">
      <DataTable
        ref="tableRef"
        v-model="data"
        :search-column="['name', 'email', 'role', 'banReason']"
        :columns="columns"
        :loading="loading"
        :left-sticky="true"
        :right-sticky="true"
        :pagination="pagination"
        :page-sizes="[10, 25, 50, 100]"
        @remove:rows="handleDeleteRows"
        @update:pagination="handleFetch"
      >
        <template #toolbarStart>
          <template v-if="table">
            <UsersDataTableFilters :table="table" />
          </template>
        </template>
      </DataTable>
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

    <DeleteUserAlert ref="deleteModal" @confirm:delete="handleSyncDelete" />
  </div>
</template>

<script lang="ts" setup>
import type { Table } from "@tanstack/vue-table";
import { ref, onMounted, computed } from "vue";
import { toast } from "vue-sonner";
import { PlusIcon } from "lucide-vue-next";

import type { PaginatedResponse, User } from "#shared/types";
import { useCsrfFetch } from "@/composables/useCsrfFetch";
import { getUsersColumns } from "@/table-columns/usersColumns";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import PageHero from "@/components/PageHero.vue";

import CreateUserModal from "@/components/modals/users/CreateUserModal.vue";
import EditUserModal from "@/components/modals/users/EditUserModal.vue";
import BanUserModal from "@/components/modals/users/BanUserModal.vue";
import DeleteUserAlert from "@/components/modals/users/DeleteUserAlert.vue";
import UsersDataTableFilters from "@/components/filters/UsersDataTableFilters.vue";

definePageMeta({ middleware: ["admin"] });
useHead({ title: "Users" });

const { csrfFetch } = useCsrfFetch();

const loading = ref(false);
const data = ref<User[]>([]);
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
});

const editModal = ref<{ open: boolean; user: User | null }>({
  open: false,
  user: null,
});
const banModal = ref<{ open: boolean; user: User | null }>({
  open: false,
  user: null,
});
const deleteModal = useTemplateRef("deleteModal");
const tableRef = useTemplateRef<any>("tableRef");
const table = computed<Table<User> | null>(() => tableRef.value?.table || null);

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

async function handleFetch(perPage?: number, page?: number) {
  loading.value = true;

  try {
    const res = await $fetch<PaginatedResponse<User>>("/api/users", {
      params: {
        limit: perPage || pagination.value.perPage,
        page: page || pagination.value.currentPage,
      },
    });

    data.value = res.data;
    pagination.value.currentPage = res.meta.currentPage;
    pagination.value.perPage = res.meta.perPage;
    pagination.value.total = res.meta.total;
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

function handleSyncDelete(user: User) {
  data.value = data.value.filter((u) => u.id !== user.id);
  data.value = [...data.value];
}

async function handleDeleteRows(items: User[]) {
  const ids = items.map((i) => i.id);
  loading.value = true;

  try {
    await csrfFetch("/api/users", {
      method: "DELETE",
      body: { ids },
    });

    data.value = data.value.filter((u) => !ids.includes(u.id));
    data.value = [...data.value];
    toast.success("Users deleted");
  } catch (err: any) {
    toast.error(err?.message || "Failed to delete users");
  } finally {
    loading.value = false;
    table.value?.resetRowSelection();
  }
}
</script>
