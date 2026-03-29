<template>
  <AlertDialog v-model:open="visible">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete application</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to delete
          <strong>{{ deleteApplication?.name }}</strong
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

import type { Application } from "#shared/types";
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

const emit =
  defineEmits<(e: "confirm:delete", application: Application) => void>();

const { csrfFetch } = useCsrfFetch();

const visible = ref(false);
const loading = ref(false);
const deleteApplication = ref<Application | null>(null);

async function handleDelete() {
  if (!deleteApplication.value) {
    return;
  }

  loading.value = true;

  try {
    await csrfFetch(`/api/applications/${deleteApplication.value.id}`, {
      method: "DELETE",
    });

    emit("confirm:delete", deleteApplication.value);

    visible.value = false;
    deleteApplication.value = null;
    toast.success("Application deleted successfully");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to delete application");
  } finally {
    loading.value = false;
  }
}

function present(application: Application) {
  deleteApplication.value = application;
  visible.value = true;
}

function dismiss() {
  visible.value = false;
  deleteApplication.value = null;
}

defineExpose({ present, dismiss });
</script>
