<script setup lang="ts">
import { ref, reactive } from "vue";
import { PlusIcon } from "lucide-vue-next";
import { toast } from "vue-sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

const emit = defineEmits(["success"]);

const isCreating = ref(false);
const isOpen = ref(false);

const form = reactive({
  name: "",
  email: "",
  role: "user" as const,
});

async function handleSubmit() {
  isCreating.value = true;

  try {
    await $fetch("/api/users", {
      method: "POST",
      body: form,
    });

    toast.success("User created successfully");
    isOpen.value = false;
    form.name = "";
    form.email = "";
    form.role = "user";
    emit("success");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to create user");
  } finally {
    isCreating.value = false;
  }
}
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button> <PlusIcon /> New user </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <form @submit.prevent="handleSubmit">
        <DialogHeader>
          <DialogTitle>New user</DialogTitle>
          <DialogDescription>
            Create a new user. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="name">Name</Label>
            <Input
              id="name"
              v-model="form.name"
              placeholder="John Doe"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="role">Role</Label>
            <Select v-model="form.role">
              <SelectTrigger id="role">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user"> User </SelectItem>
                <SelectItem value="admin"> Admin </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline" type="button"> Cancel </Button>
          </DialogClose>
          <Button type="submit" :loading="isCreating"> Save changes </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
