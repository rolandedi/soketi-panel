<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update user details. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div class="py-6">
          <FieldGroup>
            <Field>
              <FieldLabel for="edit-name">Name</FieldLabel>
              <Input
                id="edit-name"
                v-model="name"
                v-bind="nameAttrs"
                placeholder="John Doe"
              />
              <FieldError v-if="errors.name" :errors="[errors.name]" />
            </Field>
            <Field>
              <FieldLabel for="edit-email">Email</FieldLabel>
              <Input
                id="edit-email"
                v-model="email"
                v-bind="emailAttrs"
                type="email"
                placeholder="john@example.com"
              />
              <FieldError v-if="errors.email" :errors="[errors.email]" />
            </Field>
            <Field>
              <FieldLabel for="edit-role">Role</FieldLabel>
              <Select v-model="role" v-bind="roleAttrs">
                <SelectTrigger id="edit-role" class="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
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
          <Button type="submit" :loading="isSaving">
            <span v-if="!isSaving">Save</span>
            <span v-else>Saving...</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { z } from "zod";
import { toast } from "vue-sonner";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

import { useCsrfFetch } from "~/composables/useCsrfFetch";
import type { User } from "#shared/types";
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
} from "~/components/ui/dialog";

const props = defineProps<{ user: User | null }>();
const emit = defineEmits<{ success: [user: User] }>();

const isOpen = defineModel<boolean>("open", { default: false });
const isSaving = ref(false);

const { errors, handleSubmit, resetForm, defineField, setValues } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(3, "Name must be at least 3 characters"),
      email: z.email("Invalid email format"),
      role: z.enum(["user", "admin"]),
    }),
  ),
  initialValues: { name: "", email: "", role: "user" as const },
});

const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [role, roleAttrs] = defineField("role");

watch(
  () => props.user,
  (user) => {
    if (user) {
      setValues({ name: user.name, email: user.email, role: user.role });
    }
  },
);

const onSubmit = handleSubmit(async (formData) => {
  if (!props.user) return;
  isSaving.value = true;

  try {
    const { csrfFetch } = useCsrfFetch();
    await csrfFetch(`/api/users/${props.user.id}`, {
      method: "PUT",
      body: formData,
    });

    emit("success", { ...props.user, ...formData });
    isOpen.value = false;
    toast.success("User updated successfully");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to update user");
  } finally {
    isSaving.value = false;
  }
});

function handleCancel() {
  isOpen.value = false;
  resetForm();
}
</script>
