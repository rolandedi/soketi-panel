<template>
  <AlertDialog v-model:open="visible">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete user</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete
          <strong>{{ deleteUser?.name }}</strong
          >? This action cannot be undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction
          class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          :disabled="loading"
          @click="handleDelete"
        >
          {{ loading ? "Deleting..." : "Delete" }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { toast } from "vue-sonner";

import type { User } from "#shared/types";
import { useCsrfFetch } from "~/composables/useCsrfFetch";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "~/components/ui/alert-dialog";

const emit = defineEmits<(e: "confirm:delete", user: User) => void>();

const { csrfFetch } = useCsrfFetch();

const visible = ref(false);
const loading = ref(false);
const deleteUser = ref<User | null>(null);

async function handleDelete() {
  if (!deleteUser.value) {
    return;
  }

  loading.value = true;

  try {
    await csrfFetch(`/api/users/${deleteUser.value.id}`, {
      method: "DELETE",
    });

    emit("confirm:delete", deleteUser.value);

    visible.value = false;
    deleteUser.value = null;
    toast.success("User deleted successfully");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to delete user");
  } finally {
    loading.value = false;
  }
}

function present(user: User) {
  deleteUser.value = user;
  visible.value = true;
}

function dismiss() {
  visible.value = false;
  deleteUser.value = null;
}

defineExpose({ present, dismiss });
</script>
