<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>New user</DialogTitle>
          <DialogDescription>
            Create a new user. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="py-6">
          <FieldGroup>
            <Field>
              <FieldLabel for="name">Name</FieldLabel>
              <Input
                id="name"
                v-model="name"
                v-bind="nameAttrs"
                placeholder="John Doe"
              />
              <FieldError v-if="errors.name" :errors="[errors.name]" />
            </Field>
            <Field>
              <FieldLabel for="email">Email</FieldLabel>
              <Input
                id="email"
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                placeholder="john@example.com"
              />
              <FieldError v-if="errors.email" :errors="[errors.email]" />
            </Field>
            <Field>
              <FieldLabel for="password">Password</FieldLabel>
              <div class="relative">
                <Input
                  id="password"
                  v-model="password"
                  v-bind="passwordAttrs"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-6 bg-transparent border-none ring-0 text-muted-foreground"
                  @click="showPassword = !showPassword"
                >
                  <EyeIcon v-if="!showPassword" class="size-4" />
                  <EyeOffIcon v-else class="size-4" />
                </button>
              </div>
              <FieldError v-if="errors.password" :errors="[errors.password]" />
            </Field>
            <Field>
              <FieldLabel for="role">Role</FieldLabel>
              <Select v-model="role" v-bind="roleAttrs">
                <SelectTrigger id="role" class="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user"> User </SelectItem>
                  <SelectItem value="admin"> Admin </SelectItem>
                </SelectContent>
              </Select>
              <FieldError v-if="errors.role" :errors="[errors.role]" />
            </Field>
          </FieldGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" @click="handleCancel">
            Cancel
          </Button>
          <Button type="submit" :loading="isCreating">
            <span v-if="!isCreating">Create</span>
            <span v-else>Creating...</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { z } from "zod";
import { toast } from "vue-sonner";
import { PlusIcon, EyeIcon, EyeOffIcon } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  FieldError,
  FieldGroup,
  FieldLabel,
  Field,
} from "~/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
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

const emit = defineEmits(["success"]);

const isCreating = ref(false);
const isOpen = ref(false);
const showPassword = ref(false);

// Utilisation de useForm de vee-validate
const { errors, handleSubmit, resetForm, defineField } = useForm({
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
    const newUser = await $fetch("/api/users", {
      method: "POST",
      body: formData,
    });

    isOpen.value = false;
    showPassword.value = false;

    resetForm();
    emit("success", newUser);
    toast.success("User created successfully");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to create user");
  } finally {
    isCreating.value = false;
  }
});

function handleCancel() {
  isOpen.value = false;
  showPassword.value = false;

  resetForm();
}
</script>
