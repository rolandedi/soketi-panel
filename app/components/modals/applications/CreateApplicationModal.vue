<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger asChild>
      <slot />
    </DialogTrigger>
    <DialogContent class="sm:max-w-md">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>New application</DialogTitle>
          <DialogDescription>
            Create a new Soketi application.
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
                placeholder="My App"
              />
              <FieldError v-if="errors.name" :errors="[errors.name]" />
            </Field>

            <Field
              class="flex items-center justify-between rounded-lg border p-3"
            >
              <div class="space-y-1">
                <FieldLabel for="enabled">Enabled</FieldLabel>
                <p class="text-sm text-muted-foreground">
                  Allow the application to receive traffic.
                </p>
              </div>
              <div>
                <Switch id="enabled" v-model="enabled" v-bind="enabledAttrs" />
              </div>
            </Field>

            <Field
              class="flex items-center justify-between rounded-lg border p-3"
            >
              <div class="space-y-1">
                <FieldLabel for="enable-client-messages"
                  >Client messages</FieldLabel
                >
                <p class="text-sm text-muted-foreground">
                  Allow clients to send events.
                </p>
              </div>
              <div>
                <Switch
                  id="enable-client-messages"
                  v-model="enableClientMessages"
                  v-bind="enableClientMessagesAttrs"
                />
              </div>
            </Field>
          </FieldGroup>
        </div>

        <DialogFooter>
          <Button variant="outline" type="button" @click="handleCancel"
            >Cancel</Button
          >
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
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

import { useCsrfFetch } from "~/composables/useCsrfFetch";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import {
  FieldError,
  FieldGroup,
  FieldLabel,
  Field,
} from "~/components/ui/field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

const emit = defineEmits<{ success: [] }>();

const isOpen = ref(false);
const isCreating = ref(false);

const { errors, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(3, "Name must be at least 3 characters long"),
      enabled: z.boolean(),
      enable_client_messages: z.boolean(),
    }),
  ),
  initialValues: {
    name: "",
    enabled: true,
    enable_client_messages: true,
  },
});

const [name, nameAttrs] = defineField("name");
const [enabled, enabledAttrs] = defineField("enabled");
const [enableClientMessages, enableClientMessagesAttrs] = defineField(
  "enable_client_messages",
);

const onSubmit = handleSubmit(async (formData) => {
  isCreating.value = true;

  try {
    const { csrfFetch } = useCsrfFetch();
    await csrfFetch("/api/applications", {
      method: "POST",
      body: formData,
    });

    toast.success("Application created successfully");
    isOpen.value = false;
    resetForm();
    emit("success");
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to create application");
  } finally {
    isCreating.value = false;
  }
});

function handleCancel() {
  isOpen.value = false;
  resetForm();
}
</script>
