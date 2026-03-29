<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>Edit application</DialogTitle>
          <DialogDescription>
            Update the application settings.
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
                placeholder="My App"
              />
              <FieldError v-if="errors.name" :errors="[errors.name]" />
            </Field>

            <Field
              class="flex items-center justify-between rounded-lg border p-3"
            >
              <div class="space-y-1">
                <FieldLabel for="edit-enabled">Enabled</FieldLabel>
                <p class="text-sm text-muted-foreground">
                  Allow the application to receive traffic.
                </p>
              </div>
              <div>
                <Switch
                  id="edit-enabled"
                  v-model="enabled"
                  v-bind="enabledAttrs"
                />
              </div>
            </Field>

            <Field
              class="flex items-center justify-between rounded-lg border p-3"
            >
              <div class="space-y-1">
                <FieldLabel for="edit-client-messages"
                  >Client messages</FieldLabel
                >
                <p class="text-sm text-muted-foreground">
                  Allow clients to send events.
                </p>
              </div>
              <div>
                <Switch
                  id="edit-client-messages"
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
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { toast } from "vue-sonner";
import { z } from "zod";

import type { Application } from "#shared/types";
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
} from "~/components/ui/dialog";

const props = defineProps<{ application: Application | null }>();
const emit = defineEmits<{ success: [application: Application] }>();

const isOpen = defineModel<boolean>("open", { default: false });
const isSaving = ref(false);

const { errors, handleSubmit, resetForm, defineField, setValues } = useForm({
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

watch(
  () => props.application,
  (application) => {
    if (!application) return;

    setValues({
      name: application.name,
      enabled: application.enabled,
      enable_client_messages: application.enable_client_messages,
    });
  },
  { immediate: true },
);

const onSubmit = handleSubmit(async (formData) => {
  if (!props.application) return;

  isSaving.value = true;

  try {
    const { csrfFetch } = useCsrfFetch();
    const application = await csrfFetch<Application>(
      `/api/applications/${props.application.id}`,
      {
        method: "PUT",
        body: formData,
      },
    );

    toast.success("Application updated successfully");
    emit("success", application);
    isOpen.value = false;
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to update application");
  } finally {
    isSaving.value = false;
  }
});

function handleCancel() {
  isOpen.value = false;
  resetForm();
}
</script>
