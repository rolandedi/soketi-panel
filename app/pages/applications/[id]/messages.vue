<template>
  <div class="space-y-6">
    <PageHero
      title="Messages"
      :description="`Manage messages for application ${applicationLabel}.`"
    />

    <DataTable
      ref="tableRef"
      v-model="messages"
      :search-column="['id', 'channel', 'event']"
      :columns="columns"
      :loading="loading"
      :left-sticky="true"
      :right-sticky="true"
      :pagination="pagination"
      :page-sizes="[10, 25, 50, 100]"
      @remove:rows="handleDeleteRows"
      @update:pagination="handleFetch"
    />

    <PayloadModal
      v-model:open="payloadModal.open"
      :payload="payloadModal.payload"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import type { Table } from "@tanstack/vue-table";
import { toast } from "vue-sonner";

import type { Application, Message, PaginatedResponse } from "#shared/types";
import PageHero from "@/components/PageHero.vue";
import { DataTable } from "@/components/data-table";
import { useCsrfFetch } from "@/composables/useCsrfFetch";
import { getMessagesColumns } from "@/table-columns/messagesColumns";
import PayloadModal from "@/components/modals/messages/PayloadModal.vue";

useHead({ title: "Messages" });

const route = useRoute();
const { csrfFetch } = useCsrfFetch();

const tableRef = useTemplateRef<any>("tableRef");
const table = computed<Table<Message> | null>(
  () => tableRef.value?.table || null,
);

const applicationId = computed(() => {
  const id = route.params.id;
  return Array.isArray(id) ? id[0] : String(id || "");
});

const application = ref<Application | null>(null);
const applicationLabel = computed(
  () => application.value?.name || applicationId.value || "this application",
);

const loading = ref(false);
const messages = ref<Message[]>([]);
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
});

const payloadModal = ref<{ open: boolean; payload: Message["payload"] }>({
  open: false,
  payload: {},
});

const columns = computed(() =>
  getMessagesColumns({
    handleViewPayload: handleViewPayload,
    handleDelete: handleDeleteRow,
  }),
);

onMounted(() => {
  void handleFetchApplication();
  void handleFetch();
});

async function handleFetchApplication() {
  if (!applicationId.value) {
    return;
  }

  try {
    application.value = await $fetch<Application>(
      `/api/applications/${applicationId.value}`,
    );
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || "Failed to fetch application");
  }
}

async function handleFetch(perPage?: number, page?: number) {
  if (!applicationId.value) {
    return;
  }

  loading.value = true;

  try {
    const res = await $fetch<PaginatedResponse<Message>>(
      `/api/applications/${applicationId.value}/messages`,
      {
        params: {
          limit: perPage || pagination.value.perPage,
          page: page || pagination.value.currentPage,
        },
      },
    );

    messages.value = res.data;
    pagination.value.currentPage = res.meta.currentPage;
    pagination.value.perPage = res.meta.perPage;
    pagination.value.total = res.meta.total;
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || "Failed to fetch messages");
  } finally {
    loading.value = false;
  }
}

function handleViewPayload(message: Message) {
  payloadModal.value = {
    open: true,
    payload: message.payload,
  };
}

async function handleDeleteRow(message: Message) {
  loading.value = true;

  try {
    await csrfFetch(`/api/messages/${message.id}`, {
      method: "DELETE",
    });

    messages.value = messages.value.filter((item) => item.id !== message.id);
    messages.value = [...messages.value];
    pagination.value.total = Math.max(0, pagination.value.total - 1);
    toast.success("Message deleted successfully");
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || "Failed to delete message");
  } finally {
    loading.value = false;
  }
}

async function handleDeleteRows(selectedMessages: Message[]) {
  if (!selectedMessages.length) {
    return;
  }

  const ids = selectedMessages.map((message) => message.id);
  loading.value = true;

  try {
    await csrfFetch("/api/messages", {
      method: "DELETE",
      body: { ids },
    });

    messages.value = messages.value.filter(
      (message) => !ids.includes(message.id),
    );
    messages.value = [...messages.value];
    pagination.value.total = Math.max(0, pagination.value.total - ids.length);
    toast.success("Messages deleted successfully");
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || "Failed to delete messages");
  } finally {
    loading.value = false;
    table.value?.resetRowSelection();
  }
}
</script>
