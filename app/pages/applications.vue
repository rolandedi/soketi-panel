<template>
  <div class="space-y-6">
    <PageHero
      title="Applications"
      description="Manage your Soketi applications."
    >
      <CreateApplicationModal @success="handleFetch">
        <Button><PlusIcon /> New application</Button>
      </CreateApplicationModal>
    </PageHero>

    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Total applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-semibold text-foreground">
            {{ pagination.total }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Enabled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-semibold text-foreground">
            {{ enabledCount }}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Disabled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-semibold text-foreground">
            {{ disabledCount }}
          </div>
        </CardContent>
      </Card>
    </div>

    <DataTable
      ref="tableRef"
      v-model="applications"
      :search-column="['name', 'key', 'secret']"
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
        <div class="text-sm text-muted-foreground">
          Search, copy credentials, regenerate, or manage application access.
        </div>
      </template>
    </DataTable>

    <EditApplicationModal
      v-model:open="editModal.open"
      :application="editModal.application"
      @success="handleUpdated"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from "vue";
import { PlusIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

import type { Application, PaginatedResponse } from "#shared/types";
import { DataTable } from "@/components/data-table";
import { useCsrfFetch } from "@/composables/useCsrfFetch";
import { Button } from "@/components/ui/button";
import PageHero from "~/components/PageHero.vue";
import { getApplicationsColumns } from "~/table-columns/applicationsColumns";
import CreateApplicationModal from "~/components/modals/applications/CreateApplicationModal.vue";
import EditApplicationModal from "~/components/modals/applications/EditApplicationModal.vue";

useHead({ title: "Applications" });

const { csrfFetch } = useCsrfFetch();

const loading = ref(false);
const applications = ref<Application[]>([]);
const pagination = ref({
  currentPage: 1,
  perPage: 10,
  total: 0,
  enabledTotal: 0,
  disabledTotal: 0,
});

const editModal = ref<{ open: boolean; application: Application | null }>({
  open: false,
  application: null,
});

const tableRef = useTemplateRef<any>("tableRef");

const columns = computed(() =>
  getApplicationsColumns({
    handleEdit: (application) => {
      editModal.value = { open: true, application };
    },
    handleRegenerate: (application) => {
      void handleRegenerate(application);
    },
    handleDelete: (application) => {
      void handleDeleteRows([application]);
    },
  }),
);

const enabledCount = computed(() => pagination.value.enabledTotal);

const disabledCount = computed(() => pagination.value.disabledTotal);

onMounted(() => {
  handleFetch();
});

async function handleFetch(perPage?: number, page?: number) {
  loading.value = true;

  try {
    const response = await $fetch<PaginatedResponse<Application>>(
      "/api/applications",
      {
        params: {
          limit: perPage || pagination.value.perPage,
          page: page || pagination.value.currentPage,
        },
      },
    );

    applications.value = response.data;
    pagination.value.currentPage = response.meta.currentPage;
    pagination.value.perPage = response.meta.perPage;
    pagination.value.total = response.meta.total;
    pagination.value.enabledTotal = response.meta.enabledTotal ?? 0;
    pagination.value.disabledTotal = response.meta.disabledTotal ?? 0;
  } catch (error: any) {
    toast.error(error?.data?.statusMessage || "Failed to fetch applications");
  } finally {
    loading.value = false;
  }
}

function handleUpdated(application: Application) {
  const index = applications.value.findIndex(({ id }) => id === application.id);

  if (index !== -1) {
    applications.value[index] = application;
    applications.value = [...applications.value];
  }
}

async function handleDeleteRows(rows: Application[]) {
  const ids = rows.map((row) => row.id);

  loading.value = true;

  try {
    await csrfFetch("/api/applications", {
      method: "DELETE",
      body: { ids },
    });

    toast.success("Applications deleted");
    await handleFetch(pagination.value.perPage, pagination.value.currentPage);
    tableRef.value?.table?.resetRowSelection();
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to delete applications");
  } finally {
    loading.value = false;
  }
}

async function handleRegenerate(application: Application) {
  if (!globalThis.confirm(`Regenerate credentials for ${application.name}?`)) {
    return;
  }

  loading.value = true;

  try {
    const response = await csrfFetch<{ application: Application }>(
      `/api/applications/${application.id}/regenerate`,
      {
        method: "POST",
      },
    );

    handleUpdated(response.application);
    toast.success("Application credentials regenerated");
  } catch (error: any) {
    toast.error(
      error.data?.statusMessage || "Failed to regenerate credentials",
    );
  } finally {
    loading.value = false;
  }
}
</script>
