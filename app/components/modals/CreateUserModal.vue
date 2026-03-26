<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <Button> <PlusIcon /> New user </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <form @submit.prevent="onSubmit">
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
              v-model="name"
              v-bind="nameAttrs"
              placeholder="John Doe"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              v-model="email"
              v-bind="emailAttrs"
              type="email"
              placeholder="john@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              v-bind="passwordAttrs"
              type="password"
              placeholder="Enter password"
              required
            />
          </div>
          <div class="grid gap-2">
            <Label for="role">Role</Label>
            <Select v-model="role" v-bind="roleAttrs">
              <SelectTrigger id="role" class="w-full">
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
          <Button type="submit" :loading="isCreating"> Save </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
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

// Utilisation de useForm de vee-validate
const { values, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(1, "Name is required"),
      email: z.email("Invalid email format"),
      role: z.string().min(1, "Role is required"),
      password: z.string().min(1, "Password is required"),
    }),
  ),
  initialValues: {
    name: "",
    email: "",
    role: "user" as const,
    password: "Password123",
  },
});

// Liaisons pour les champs du formulaire
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [role, roleAttrs] = defineField("role");
const [password, passwordAttrs] = defineField("password");

const onSubmit = handleSubmit(async (formData) => {
  isCreating.value = true;

  try {
    await $fetch("/api/users", {
      method: "POST",
      body: formData,
    });

    toast.success("User created successfully");
    isOpen.value = false;
    resetForm();
    emit("success");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to create user");
  } finally {
    isCreating.value = false;
  }
});
</script>
