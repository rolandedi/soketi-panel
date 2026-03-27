<template>
  <div class="space-y-6">
    <PageHero title="Users" description="Manage your Soketi Panel users.">
      <CreateUserModal @success="handleCreated">
        <Button variant="default"> <PlusIcon /> New user </Button>
      </CreateUserModal>
    </PageHero>

    <div class="space-y-4">
      <DataTable
        v-model="data"
        filter-column="name"
        :columns="columns"
        :loading="loading"
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
      @success="handleBanUpdated"
    />

    <AlertDialog v-model:open="deleteModal.open">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete
            <strong>{{ deleteModal.user?.name }}</strong
            >? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            :disabled="isDeleting"
            @click="confirmDelete"
          >
            {{ isDeleting ? "Deleting..." : "Delete" }}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { toast } from "vue-sonner";
import { PlusIcon } from "lucide-vue-next";
import { useCsrfFetch } from "~/composables/useCsrfFetch";

import type { PaginatedResponse, User } from "#shared/types";
import { getUsersColumns } from "~/table-columns/usersColumns";
import { DataTable } from "~/components/data-table";
import PageHero from "~/components/PageHero.vue";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

import CreateUserModal from "~/components/modals/users/CreateUserModal.vue";
import EditUserModal from "~/components/modals/users/EditUserModal.vue";
import BanUserModal from "~/components/modals/users/BanUserModal.vue";

useHead({ title: "Users" });

const loading = ref(false);
const isDeleting = ref(false);
const data = ref<User[]>([]);

const editModal = ref<{ open: boolean; user: User | null }>({
  open: false,
  user: null,
});
const banModal = ref<{ open: boolean; user: User | null }>({
  open: false,
  user: null,
});
const deleteModal = ref<{ open: boolean; user: User | null }>({
  open: false,
  user: null,
});

const { csrfFetch } = useCsrfFetch();

const columns = computed(() =>
  getUsersColumns({
    handleEdit: (user) => {
      editModal.value = { open: true, user };
    },
    handleBan: (user) => {
      banModal.value = { open: true, user };
    },
    handleDelete: (user) => {
      deleteModal.value = { open: true, user };
    },
  }),
);

onMounted(() => {
  handleFetch();
});

function handleCreated(item: User) {
  data.value.push(item);
}

function handleUpdated(updated: User) {
  const index = data.value.findIndex((u) => u.id === updated.id);
  if (index !== -1) data.value[index] = updated;
}

function handleBanUpdated(updated: User) {
  const index = data.value.findIndex((u) => u.id === updated.id);
  if (index !== -1) data.value[index] = updated;
}

async function confirmDelete() {
  if (!deleteModal.value.user) return;
  isDeleting.value = true;

  try {
    await csrfFetch(`/api/users/${deleteModal.value.user.id}`, {
      method: "DELETE",
    });

    data.value = data.value.filter((u) => u.id !== deleteModal.value.user!.id);
    deleteModal.value.open = false;
    toast.success("User deleted successfully");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to delete user");
  } finally {
    isDeleting.value = false;
  }
}

async function handleFetch() {
  loading.value = true;

  try {
    const res = await $fetch<PaginatedResponse<User>>("/api/users");
    data.value = res.data;
  } catch (err: any) {
    toast.error(err?.message || "Failed to fetch users");
  } finally {
    loading.value = false;
  }
}
</script>
