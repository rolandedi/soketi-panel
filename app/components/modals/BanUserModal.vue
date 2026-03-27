<template>
  <Dialog v-model:open="isOpen">
    <DialogContent class="sm:max-w-md">
      <form @submit.prevent="onSubmit">
        <DialogHeader>
          <DialogTitle>{{ user?.banned ? "Unban" : "Ban" }} user</DialogTitle>
          <DialogDescription>
            <template v-if="user?.banned">
              Remove the ban from <strong>{{ user?.name }}</strong
              >.
            </template>
            <template v-else>
              Ban <strong>{{ user?.name }}</strong> from the panel.
            </template>
          </DialogDescription>
        </DialogHeader>
        <div v-if="!user?.banned" class="py-6">
          <FieldGroup>
            <Field>
              <FieldLabel for="ban-reason"
                >Reason
                <span class="text-muted-foreground"
                  >(optional)</span
                ></FieldLabel
              >
              <Input
                id="ban-reason"
                v-model="banReason"
                v-bind="banReasonAttrs"
                placeholder="Describe the reason..."
              />
              <FieldError
                v-if="errors.banReason"
                :errors="[errors.banReason]"
              />
            </Field>
            <Field>
              <FieldLabel for="ban-expires"
                >Expiration date
                <span class="text-muted-foreground"
                  >(optional)</span
                ></FieldLabel
              >
              <Input
                id="ban-expires"
                v-model="banExpires"
                v-bind="banExpiresAttrs"
                type="datetime-local"
              />
              <FieldError
                v-if="errors.banExpires"
                :errors="[errors.banExpires]"
              />
            </Field>
          </FieldGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" @click="isOpen = false">
            Cancel
          </Button>
          <Button
            type="submit"
            :loading="isBanning"
            :variant="user?.banned ? 'default' : 'destructive'"
          >
            <span v-if="!isBanning">{{ user?.banned ? "Unban" : "Ban" }}</span>
            <span v-else>{{
              user?.banned ? "Unbanning..." : "Banning..."
            }}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useCsrfFetch } from "~/composables/useCsrfFetch";
import { z } from "zod";
import { toast } from "vue-sonner";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

const props = defineProps<{ user: User | null }>();
const emit = defineEmits<{
  success: [user: User];
}>();

const isOpen = defineModel<boolean>("open", { default: false });
const isBanning = ref(false);

const { errors, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      banReason: z.string().max(255).optional(),
      banExpires: z.string().optional(),
    }),
  ),
  initialValues: { banReason: "", banExpires: "" },
});

const [banReason, banReasonAttrs] = defineField("banReason");
const [banExpires, banExpiresAttrs] = defineField("banExpires");

watch(isOpen, (open) => {
  if (!open) resetForm();
});

const onSubmit = handleSubmit(async (formData) => {
  if (!props.user) return;
  isBanning.value = true;

  const willBeBanned = !props.user.banned;

  try {
    const { csrfFetch } = useCsrfFetch();
    await csrfFetch("/api/users/ban", {
      method: "POST",
      body: {
        userId: props.user.id,
        banned: willBeBanned,
        banReason: willBeBanned ? formData.banReason : null,
        banExpires: willBeBanned ? formData.banExpires : null,
      },
    });

    emit("success", {
      ...props.user,
      banned: willBeBanned,
      banReason: willBeBanned ? formData.banReason || null : null,
      banExpires: willBeBanned ? formData.banExpires || null : null,
    });
    isOpen.value = false;
    toast.success(`User ${willBeBanned ? "banned" : "unbanned"} successfully`);
  } catch (error: any) {
    toast.error(error.data?.statusMessage || "Failed to update ban status");
  } finally {
    isBanning.value = false;
  }
});
</script>
