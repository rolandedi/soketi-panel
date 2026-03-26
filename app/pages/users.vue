<template>
  <div class="space-y-6">
    <PageHero title="Users" description="Manage your Soketi Panel users.">
      <Dialog>
        <form>
          <DialogTrigger as-child>
            <Button> <PlusIcon /> New user </Button>
          </DialogTrigger>
          <DialogContent class="sm:max-w-106.25">
            <DialogHeader>
              <DialogTitle>New user</DialogTitle>
              <DialogDescription>
                Create a new user. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4">
              <div class="grid gap-3">
                <Label for="name-1">Name</Label>
                <Input id="name-1" name="name" default-value="Pedro Duarte" />
              </div>
              <div class="grid gap-3">
                <Label for="username-1">Username</Label>
                <Input
                  id="username-1"
                  name="username"
                  default-value="@peduarte"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose as-child>
                <Button variant="outline"> Cancel </Button>
              </DialogClose>
              <Button type="submit"> Save changes </Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </PageHero>

    <div class="space-y-4">
      <DataTable
        v-model="data"
        filter-column="name"
        :columns="usersColumns"
        :loading="loading"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { PlusIcon } from "lucide-vue-next";

import type { PaginatedResponse, User } from "#shared/types";
import { usersColumns } from "~/table-columns/usersColumns";
import { DataTable } from "~/components/data-table";
import PageHero from "~/components/PageHero.vue";

useHead({ title: "Users" });

const loading = ref(false);
const data = ref<User[]>([]);

onMounted(() => {
  handleFetch();
});

async function handleFetch() {
  loading.value = true;

  try {
    const res = await $fetch<PaginatedResponse<User>>("/api/users");
    data.value = res.data;
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
}
</script>
