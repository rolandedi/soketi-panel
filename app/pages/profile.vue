<template>
  <div class="relative mx-auto max-w-3xl space-y-8">
    <PageHero
      title="Profile"
      description="Manage your identity, security, and active sessions."
    />

    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardContent class="flex flex-col items-start gap-4">
          <div class="flex items-center gap-1.5 text-muted-foreground">
            <UserRoundIcon class="size-5" aria-hidden="true" />
            <span class="text-sm">Role</span>
          </div>
          <div class="min-w-0">
            <p class="truncate text-base font-semibold capitalize">
              {{ user?.role ?? "User" }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="flex flex-col items-start gap-4">
          <div class="flex items-center gap-1.5 text-muted-foreground">
            <MailCheckIcon class="size-5" aria-hidden="true" />
            <span class="text-sm">Email status</span>
          </div>
          <div class="min-w-0">
            <p class="truncate text-base font-semibold">
              {{ user?.emailVerified ? "Verified" : "Pending verification" }}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="flex flex-col items-start gap-4">
          <div class="flex items-center gap-1.5 text-muted-foreground">
            <ShieldCheckIcon class="size-5" aria-hidden="true" />
            <span class="text-sm">Active sessions</span>
          </div>
          <div class="min-w-0">
            <p class="text-base font-semibold">{{ sessions.length }}</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="overflow-hidden">
      <CardHeader class="border-b">
        <CardTitle>Identity</CardTitle>
        <CardDescription>
          Keep the public-facing name and email tied to your account up to date.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div class="flex flex-col items-start gap-6">
          <section
            class="w-full rounded-2xl border border-border/60 bg-muted p-5"
          >
            <div class="space-y-5">
              <div class="flex items-center gap-4">
                <button
                  type="button"
                  class="group relative shrink-0 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  :aria-label="avatarActionLabel"
                  @click="openAvatarPicker"
                >
                  <Avatar
                    class="size-24 border-4 border-background shadow-lg ring-1 ring-border/80 transition-transform duration-200 group-hover:scale-[1.01]"
                  >
                    <AvatarImage
                      v-if="avatarPreview"
                      :src="avatarPreview"
                      :alt="user?.name ?? 'Profile avatar'"
                    />
                    <AvatarFallback class="text-lg font-semibold">
                      {{ getInitials(user?.name ?? "") }}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    class="absolute inset-0 flex items-center justify-center rounded-full bg-black/45 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                  >
                    <CameraIcon class="size-5" aria-hidden="true" />
                  </div>
                </button>

                <div class="min-w-0 space-y-1">
                  <p class="truncate text-lg font-semibold">
                    {{ user?.name ?? "Profile" }}
                  </p>
                  <p class="truncate text-sm text-muted-foreground">
                    {{ user?.email }}
                  </p>
                  <p class="text-xs text-muted-foreground">
                    Member since {{ formatLongDate(user?.createdAt) }}
                  </p>
                </div>
              </div>

              <div class="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  @click="openAvatarPicker"
                  :disabled="isAvatarUploading"
                >
                  <CameraIcon
                    v-if="!isAvatarUploading"
                    class="size-4"
                    aria-hidden="true"
                  />
                  <Loader2Icon
                    v-else
                    class="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Change photo
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  @click="resetAvatarSelection"
                  :disabled="isAvatarUploading || !selectedAvatarFile"
                >
                  Reset
                </Button>
              </div>

              <p class="m-0 text-sm text-muted-foreground">
                PNG, JPG, or WebP up to 2 MB.
              </p>

              <input
                ref="avatarInputRef"
                class="hidden"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                @change="handleAvatarChange"
              />

              <div
                v-if="selectedAvatarFile"
                class="rounded-2xl border border-dashed border-border/70 bg-background/80 p-4 text-sm text-muted-foreground"
              >
                Selected file:
                <span class="font-medium text-foreground">{{
                  selectedAvatarFile.name
                }}</span>
              </div>
            </div>
          </section>

          <form class="space-y-5 w-full" @submit="profileSubmitHandler">
            <FieldGroup class="gap-5">
              <Field>
                <FieldLabel for="profile-name">Full name</FieldLabel>
                <Input
                  id="profile-name"
                  v-model="profileName"
                  v-bind="profileNameAttrs"
                  type="text"
                  autocomplete="name"
                  placeholder="Your name"
                  :disabled="isProfileSaving"
                />
                <FieldDescription>
                  This name appears in the navbar and user menu.
                </FieldDescription>
                <FieldError :errors="[profileErrors.name]" />
              </Field>

              <Field>
                <FieldLabel for="profile-email">Email address</FieldLabel>
                <Input
                  id="profile-email"
                  v-model="profileEmail"
                  v-bind="profileEmailAttrs"
                  type="email"
                  autocomplete="email"
                  placeholder="name@example.com"
                  :disabled="isProfileSaving"
                />
                <div class="flex flex-wrap items-center gap-2">
                  <FieldDescription>
                    Used for login and account recovery.
                  </FieldDescription>
                  <Badge :variant="user?.emailVerified ? 'default' : 'outline'">
                    {{ user?.emailVerified ? "Verified" : "Unverified" }}
                  </Badge>
                </div>
                <FieldError :errors="[profileErrors.email]" />
              </Field>

              <div class="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="submit"
                  class="w-full md:w-auto"
                  :disabled="isProfileSaving || !profileMeta.dirty"
                >
                  <Loader2Icon
                    v-if="isProfileSaving"
                    class="mr-2 size-4 animate-spin"
                    aria-hidden="true"
                  />
                  Save changes
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>
          Change your password and optionally sign out every other device.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="space-y-5" @submit="passwordSubmitHandler">
          <FieldGroup class="gap-5">
            <Field>
              <FieldLabel for="current-password">Current password</FieldLabel>
              <div class="relative">
                <input
                  id="current-password"
                  name="current-password"
                  v-model="currentPassword"
                  v-bind="currentPasswordAttrs"
                  :type="showCurrentPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  :disabled="isPasswordSaving"
                  class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="absolute inset-y-0 right-0 h-full hover:bg-transparent"
                  :aria-label="
                    showCurrentPassword
                      ? 'Hide current password'
                      : 'Show current password'
                  "
                  @click="showCurrentPassword = !showCurrentPassword"
                  :disabled="isPasswordSaving"
                >
                  <EyeOffIcon
                    v-if="showCurrentPassword"
                    class="size-4"
                    aria-hidden="true"
                  />
                  <EyeIcon v-else class="size-4" aria-hidden="true" />
                </Button>
              </div>
              <FieldError :errors="[passwordErrors.currentPassword]" />
            </Field>

            <Field>
              <FieldLabel for="new-password">New password</FieldLabel>
              <div class="relative">
                <input
                  id="new-password"
                  name="new-password"
                  v-model="newPassword"
                  v-bind="newPasswordAttrs"
                  :type="showNewPassword ? 'text' : 'password'"
                  autocomplete="off"
                  placeholder="At least 8 characters"
                  :disabled="isPasswordSaving"
                  class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="absolute inset-y-0 right-0 h-full hover:bg-transparent"
                  :aria-label="
                    showNewPassword ? 'Hide new password' : 'Show new password'
                  "
                  @click="showNewPassword = !showNewPassword"
                  :disabled="isPasswordSaving"
                >
                  <EyeOffIcon
                    v-if="showNewPassword"
                    class="size-4"
                    aria-hidden="true"
                  />
                  <EyeIcon v-else class="size-4" aria-hidden="true" />
                </Button>
              </div>
              <FieldError :errors="[passwordErrors.newPassword]" />
            </Field>

            <Field>
              <FieldLabel for="confirm-password">Confirm password</FieldLabel>
              <div class="relative">
                <input
                  id="confirm-password"
                  name="confirm-password"
                  v-model="confirmPassword"
                  v-bind="confirmPasswordAttrs"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Repeat the new password"
                  :disabled="isPasswordSaving"
                  class="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive pr-11"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  class="absolute inset-y-0 right-0 h-full hover:bg-transparent"
                  :aria-label="
                    showConfirmPassword
                      ? 'Hide confirmation password'
                      : 'Show confirmation password'
                  "
                  @click="showConfirmPassword = !showConfirmPassword"
                  :disabled="isPasswordSaving"
                >
                  <EyeOffIcon
                    v-if="showConfirmPassword"
                    class="size-4"
                    aria-hidden="true"
                  />
                  <EyeIcon v-else class="size-4" aria-hidden="true" />
                </Button>
              </div>
              <FieldError :errors="[passwordErrors.confirmPassword]" />
            </Field>

            <Field class="rounded-2xl border border-border/60 bg-muted/30 p-4">
              <div class="flex items-center justify-between gap-4">
                <div>
                  <FieldLabel for="revoke-other-sessions">
                    Sign out other devices
                  </FieldLabel>
                  <FieldDescription>
                    Revoke all other sessions after a successful password
                    change.
                  </FieldDescription>
                </div>
                <Switch
                  id="revoke-other-sessions"
                  v-model="revokeOtherSessions"
                />
              </div>
            </Field>

            <div class="flex items-center justify-end gap-3 pt-2">
              <Button
                type="submit"
                class="w-full md:w-auto"
                :disabled="isPasswordSaving || !passwordMeta.dirty"
              >
                <Loader2Icon
                  v-if="isPasswordSaving"
                  class="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
                Update password
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>

    <Card>
      <CardHeader class="flex flex-row items-start justify-between gap-4">
        <div class="space-y-1">
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            Review and revoke the devices currently signed in to your account.
          </CardDescription>
        </div>

        <Button
          type="button"
          variant="outline"
          size="icon"
          :disabled="isSessionsLoading"
          @click="loadSessions"
        >
          <RefreshCwIcon
            v-if="!isSessionsLoading"
            class="size-4"
            aria-hidden="true"
          />
          <Loader2Icon v-else class="size-4 animate-spin" aria-hidden="true" />
        </Button>
      </CardHeader>

      <CardContent class="space-y-4">
        <div
          v-if="isSessionsLoading"
          class="rounded-2xl border border-dashed border-border/70 p-6 text-sm text-muted-foreground"
        >
          Loading active sessions...
        </div>

        <div
          v-else-if="sessionsError"
          class="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
        >
          {{ sessionsError }}
        </div>

        <div
          v-else-if="sessions.length === 0"
          class="rounded-2xl border border-dashed border-border/70 p-6 text-sm text-muted-foreground"
        >
          No active sessions were found.
        </div>

        <div v-else class="flex flex-col gap-6">
          <article
            v-for="entry in sessions"
            :key="entry.token"
            class="group flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
          >
            <div class="flex items-start gap-3">
              <div class="text-muted-foreground">
                <component
                  :is="getSessionIcon(entry.userAgent)"
                  class="size-6"
                  aria-hidden="true"
                />
              </div>
              <div class="flex flex-col min-w-0 items-start gap-1">
                <div
                  class="flex items-center gap-2 min-w-0 text-sm font-medium"
                >
                  <span class="truncate">
                    {{ getSessionEnvironment(entry.userAgent).os }} ·
                    {{ getSessionEnvironment(entry.userAgent).browser }}
                  </span>
                </div>
                <div
                  class="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <div class="inline-block max-w-40 md:max-w-50 truncate">
                    {{ entry.ipAddress ?? "Unknown" }}
                  </div>
                  <span
                    v-if="entry.token === currentSessionToken"
                    class="text-primary font-medium"
                  >
                    This device
                  </span>
                  <span v-else class="max-w-40 truncate">
                    Last seen:
                    {{
                      formatLongDate(
                        entry.updatedAt ?? entry.createdAt ?? entry.expiresAt,
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>

            <Button
              v-if="entry.token !== currentSessionToken"
              type="button"
              variant="ghost"
              class="md:aspect-square md:invisible group-hover:visible hover:bg-destructive/10 hover:text-destructive"
              :disabled="revokeingToken === entry.token"
              @click="revokeSession(entry.token)"
            >
              <Loader2Icon
                v-if="revokeingToken === entry.token"
                class="size-4 animate-spin"
                aria-hidden="true"
              />
              <Trash2Icon v-else class="size-4" aria-hidden="true" />
              <span class="md:hidden">Revoke</span>
            </Button>
          </article>
        </div>
      </CardContent>

      <CardFooter class="flex flex-col items-start gap-4 border-t bg-muted/20">
        <div class="space-y-1">
          <p class="text-sm font-medium">Protect your account</p>
          <p class="text-sm text-muted-foreground">
            Signing out other devices will force them to log in again.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger as-child>
            <Button
              type="button"
              variant="destructive"
              class="w-full md:w-auto"
              :disabled="sessions.length <= 1 || isRevokingOthers"
            >
              <Loader2Icon
                v-if="isRevokingOthers"
                class="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
              Sign out other devices
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sign out other devices?</AlertDialogTitle>
              <AlertDialogDescription>
                This will revoke every session except the one you are currently
                using.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction @click="handleRevokeOtherSessions">
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { format, formatDistanceToNow } from "date-fns";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";
import { z } from "zod";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  CameraIcon,
  RefreshCwIcon,
  Trash2Icon,
  UserRoundIcon,
  MailCheckIcon,
  ShieldCheckIcon,
  GlobeIcon,
  MonitorIcon,
  SmartphoneIcon,
} from "lucide-vue-next";
import type { Component } from "vue";

import { getInitials } from "#shared/utils";
import { useAuth } from "~/composables/useAuth";
import { useCsrfFetch } from "~/composables/useCsrfFetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProfileSession {
  token: string;
  expiresAt: string;
  createdAt?: string;
  updatedAt?: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

const { user, session } = useAuth();
const { csrfFetch } = useCsrfFetch();

useHead({ title: "Profile" });

const avatarInputRef = ref<HTMLInputElement | null>(null);
const avatarPreview = ref<string | null>(null);
const selectedAvatarFile = ref<File | null>(null);
const isAvatarUploading = ref(false);

const sessions = ref<ProfileSession[]>([]);
const isSessionsLoading = ref(false);
const sessionsError = ref<string | null>(null);
const revokeingToken = ref<string | null>(null);
const isRevokingOthers = ref(false);

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const revokeOtherSessions = ref(true);

const profileSchema = toTypedSchema(
  z.object({
    name: z
      .string()
      .trim()
      .min(3, "Name must be at least 3 characters long")
      .max(255, "Name must be at most 255 characters long"),
    email: z.email("Invalid email address"),
  }),
);

const passwordSchema = toTypedSchema(
  z
    .object({
      currentPassword: z
        .string()
        .min(8, "Current password must be at least 8 characters long"),
      newPassword: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      confirmPassword: z
        .string()
        .min(8, "Password confirmation must be at least 8 characters long"),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }),
);

const {
  errors: profileErrors,
  handleSubmit: handleProfileSubmit,
  defineField: defineProfileField,
  setValues: setProfileValues,
  meta: profileMeta,
} = useForm({
  validationSchema: profileSchema,
  initialValues: {
    name: "",
    email: "",
  },
});

const {
  errors: passwordErrors,
  handleSubmit: handlePasswordSubmit,
  defineField: definePasswordField,
  resetForm: resetPasswordForm,
  meta: passwordMeta,
} = useForm({
  validationSchema: passwordSchema,
  initialValues: {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  },
});

const [profileName, profileNameAttrs] = defineProfileField("name");
const [profileEmail, profileEmailAttrs] = defineProfileField("email");
const [currentPassword, currentPasswordAttrs] =
  definePasswordField("currentPassword");
const [newPassword, newPasswordAttrs] = definePasswordField("newPassword");
const [confirmPassword, confirmPasswordAttrs] =
  definePasswordField("confirmPassword");

const isProfileSaving = ref(false);
const isPasswordSaving = ref(false);

const currentSessionToken = computed(
  () => session.value?.data?.session?.token ?? null,
);
const avatarActionLabel = computed(() =>
  selectedAvatarFile.value
    ? `Replace the selected avatar ${selectedAvatarFile.value.name}`
    : "Modify profile picture",
);

watch(
  user,
  (currentUser) => {
    if (!currentUser) {
      return;
    }

    setProfileValues({
      name: currentUser.name,
      email: currentUser.email,
    });
    avatarPreview.value = currentUser.image;
  },
  { immediate: true },
);

const profileSubmitHandler = handleProfileSubmit(async (values) => {
  isProfileSaving.value = true;

  try {
    await csrfFetch("/api/profile", {
      method: "PUT",
      body: values,
    });

    await session.value?.refetch();
    toast.success("Profile updated");
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to update profile"));
  } finally {
    isProfileSaving.value = false;
  }
});

const passwordSubmitHandler = handlePasswordSubmit(async (values) => {
  isPasswordSaving.value = true;

  try {
    await csrfFetch("/api/profile/password", {
      method: "POST",
      body: {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        revokeOtherSessions: revokeOtherSessions.value,
      },
    });

    resetPasswordForm();
    revokeOtherSessions.value = true;
    await session.value?.refetch();
    await loadSessions();
    toast.success("Password updated");
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to change password"));
  } finally {
    isPasswordSaving.value = false;
  }
});

function openAvatarPicker() {
  avatarInputRef.value?.click();
}

function resetAvatarSelection() {
  if (selectedAvatarFile.value && avatarPreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(avatarPreview.value);
  }

  selectedAvatarFile.value = null;
  avatarPreview.value = user.value?.image ?? null;

  if (avatarInputRef.value) {
    avatarInputRef.value.value = "";
  }
}

async function handleAvatarChange(event: Event) {
  const target = event.target as HTMLInputElement | null;
  const file = target?.files?.[0] ?? null;

  if (!file) {
    return;
  }

  if (!isValidAvatarFile(file)) {
    toast.error("Please upload a PNG, JPG, or WebP image up to 2 MB.");
    if (target) {
      target.value = "";
    }
    return;
  }

  if (avatarPreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(avatarPreview.value);
  }

  selectedAvatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
  isAvatarUploading.value = true;

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const response = await csrfFetch<{ image: string }>("/api/profile/avatar", {
      method: "POST",
      body: formData,
    });

    avatarPreview.value = response.image;
    selectedAvatarFile.value = null;
    await session.value?.refetch();
    toast.success("Avatar updated");
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to update avatar"));
    avatarPreview.value = user.value?.image ?? null;
    selectedAvatarFile.value = null;
  } finally {
    isAvatarUploading.value = false;
    if (target) {
      target.value = "";
    }
  }
}

async function loadSessions() {
  isSessionsLoading.value = true;
  sessionsError.value = null;

  try {
    const response = await csrfFetch<ProfileSession[]>(
      "/api/profile/sessions",
      {
        method: "GET",
      },
    );

    sessions.value = response;
  } catch (error) {
    sessionsError.value = getErrorMessage(error, "Unable to load sessions");
  } finally {
    isSessionsLoading.value = false;
  }
}

async function revokeSession(token: string) {
  revokeingToken.value = token;

  try {
    await csrfFetch("/api/profile/sessions/" + encodeURIComponent(token), {
      method: "DELETE",
    });

    sessions.value = sessions.value.filter((entry) => entry.token !== token);
    toast.success("Session revoked");
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to revoke session"));
  } finally {
    revokeingToken.value = null;
  }
}

async function handleRevokeOtherSessions() {
  isRevokingOthers.value = true;

  try {
    await csrfFetch("/api/profile/sessions/revoke-others", {
      method: "POST",
    });

    await loadSessions();
    toast.success("Other sessions revoked");
  } catch (error) {
    toast.error(getErrorMessage(error, "Unable to revoke other sessions"));
  } finally {
    isRevokingOthers.value = false;
  }
}

function getSessionIcon(userAgent?: string | null): Component {
  const normalizedUserAgent = (userAgent ?? "").toLowerCase();

  if (
    normalizedUserAgent.includes("iphone") ||
    normalizedUserAgent.includes("android") ||
    normalizedUserAgent.includes("mobile")
  ) {
    return SmartphoneIcon;
  }

  if (
    normalizedUserAgent.includes("windows") ||
    normalizedUserAgent.includes("macintosh") ||
    normalizedUserAgent.includes("linux")
  ) {
    return MonitorIcon;
  }

  return GlobeIcon;
}

function getSessionLabel(userAgent?: string | null) {
  const normalizedUserAgent = (userAgent ?? "").toLowerCase();

  if (
    normalizedUserAgent.includes("iphone") ||
    normalizedUserAgent.includes("android") ||
    normalizedUserAgent.includes("mobile")
  ) {
    return "Mobile device";
  }

  if (
    normalizedUserAgent.includes("windows") ||
    normalizedUserAgent.includes("macintosh") ||
    normalizedUserAgent.includes("linux")
  ) {
    return "Desktop device";
  }

  return "Connected session";
}

function getSessionEnvironment(userAgent: string | null | undefined = "") {
  const normalizedUserAgent = userAgent;

  if (!normalizedUserAgent) {
    return {
      os: "Unknown",
      browser: "Unknown",
    };
  }

  let browser = "Browser";

  if (normalizedUserAgent.includes("Edg/")) {
    browser = "Edge";
  } else if (normalizedUserAgent.includes("Chrome/")) {
    browser = "Chrome";
  } else if (normalizedUserAgent.includes("Firefox/")) {
    browser = "Firefox";
  } else if (normalizedUserAgent.includes("Safari/")) {
    browser = "Safari";
  }

  let os = "Unknown";

  if (normalizedUserAgent.includes("Windows NT")) {
    os = "Windows";
  } else if (
    normalizedUserAgent.includes("Macintosh") ||
    normalizedUserAgent.includes("Mac OS X")
  ) {
    os = "macOS";
  } else if (normalizedUserAgent.includes("Android")) {
    os = "Android";
  } else if (
    normalizedUserAgent.includes("iPhone") ||
    normalizedUserAgent.includes("iPad") ||
    normalizedUserAgent.includes("iPod")
  ) {
    os = "iOS";
  } else if (normalizedUserAgent.includes("Linux")) {
    os = "Linux";
  }

  return { os, browser };
}

function formatLongDate(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  return format(new Date(value), "PPP p");
}

function formatRelativeDate(value?: string | null) {
  if (!value) {
    return "Unknown";
  }

  return formatDistanceToNow(new Date(value), { addSuffix: true });
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error &&
    "data" in error &&
    typeof (error as { data?: { message?: string } }).data?.message === "string"
  ) {
    return (error as { data: { message: string } }).data.message;
  }

  return fallback;
}

function isValidAvatarFile(file: File) {
  const allowedTypes = new Set(["image/png", "image/jpeg", "image/webp"]);
  const maxSizeInBytes = 2 * 1024 * 1024;

  return allowedTypes.has(file.type) && file.size <= maxSizeInBytes;
}

watch(
  avatarPreview,
  (nextValue, previousValue) => {
    if (previousValue?.startsWith("blob:") && previousValue !== nextValue) {
      URL.revokeObjectURL(previousValue);
    }
  },
  { flush: "post" },
);

onBeforeUnmount(() => {
  if (avatarPreview.value?.startsWith("blob:")) {
    URL.revokeObjectURL(avatarPreview.value);
  }
});

onMounted(() => {
  void loadSessions();
});
</script>
