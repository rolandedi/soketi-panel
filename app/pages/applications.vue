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
      <Card
        v-for="card in kpiCards"
        :key="card.label"
        class="border-border/70 shadow-none"
      >
        <CardHeader class="gap-1.5 pb-3">
          <CardTitle class="text-sm font-medium text-muted-foreground">
            {{ card.label }}
          </CardTitle>
          <div class="text-3xl font-semibold tracking-tight text-foreground">
            {{ card.value }}
          </div>
        </CardHeader>

        <CardContent>
          <p class="text-sm leading-5 text-muted-foreground">
            {{ card.description }}
          </p>
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
        <template v-if="table">
          <ApplicationsDataTableFilters :table="table" />
        </template>
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
import type { Table } from "@tanstack/vue-table";
import { PlusIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";

import type { Application, PaginatedResponse } from "#shared/types";
import { DataTable } from "@/components/data-table";
import { useCsrfFetch } from "@/composables/useCsrfFetch";
import { Button } from "@/components/ui/button";
import PageHero from "~/components/PageHero.vue";
import { getApplicationsColumns } from "~/table-columns/applicationsColumns";
import ApplicationsDataTableFilters from "~/components/filters/ApplicationsDataTableFilters.vue";
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
const table = computed<Table<Application> | null>(
  () => tableRef.value?.table || null,
);

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

const kpiCards = computed(() => [
  {
    label: "Total applications",
    value: pagination.value.total,
    description: "All applications available in the current workspace.",
  },
  {
    label: "Enabled",
    value: enabledCount.value,
    description: "Applications currently allowed to receive traffic.",
  },
  {
    label: "Disabled",
    value: disabledCount.value,
    description: "Applications currently paused or blocked from traffic.",
  },
]);

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
    const previousApplication = applications.value[index];

    applications.value[index] = application;
    applications.value = [...applications.value];

    syncApplicationTotals(previousApplication, application);
  }
}

function syncApplicationTotals(
  previousApplication: Application,
  nextApplication: Application,
) {
  if (previousApplication.enabled === nextApplication.enabled) {
    return;
  }

  if (nextApplication.enabled) {
    pagination.value.enabledTotal += 1;
    pagination.value.disabledTotal = Math.max(
      0,
      pagination.value.disabledTotal - 1,
    );
    return;
  }

  pagination.value.disabledTotal += 1;
  pagination.value.enabledTotal = Math.max(
    0,
    pagination.value.enabledTotal - 1,
  );
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
