<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-xl"> Welcome back </CardTitle>
      <CardDescription> Login with your email account </CardDescription>
    </CardHeader>
    <CardContent class="space-y-4">
      <Alert v-if="accessNotice" :variant="accessNotice.variant">
        <TriangleAlert class="h-4 w-4" />
        <AlertTitle>{{ accessNotice.title }}</AlertTitle>
        <AlertDescription>
          {{ accessNotice.description }}
        </AlertDescription>
      </Alert>

      <form @submit="onSubmit">
        <FieldGroup>
          <Field>
            <FieldLabel for="email">Email</FieldLabel>
            <Input
              v-model="email"
              v-bind="emailAttrs"
              id="email"
              type="email"
              placeholder="m@example.com"
              :disabled="isLoading"
            />
            <FieldError :errors="[errors.email]" />
          </Field>
          <Field>
            <FieldLabel for="password">Password</FieldLabel>
            <div class="relative">
              <Input
                v-model="password"
                v-bind="passwordAttrs"
                id="password"
                placeholder="********"
                :type="showPassword ? 'text' : 'password'"
                :disabled="isLoading"
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                class="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
                @click="showPassword = !showPassword"
                :disabled="isLoading"
              >
                <EyeIcon v-if="!showPassword" class="w-5 h-5" />
                <EyeOffIcon v-else class="w-5 h-5" />
              </Button>
            </div>
            <FieldError :errors="[errors.password]" />
          </Field>
          <Field>
            <div class="flex items-center gap-3">
              <Checkbox
                v-model="remember"
                v-bind="rememberAttrs"
                id="remember"
                :disabled="isLoading"
              />
              <Label for="remember">Remember me</Label>
            </div>
          </Field>
          <Field>
            <Button type="submit" :disabled="isLoading">
              <Loader2Icon v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
              Login
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { toast } from "vue-sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  TriangleAlert,
} from "lucide-vue-next";
import { useAuth } from "~/composables/useAuth";

definePageMeta({
  layout: "auth",
});

useHead({ title: "Login" });

const showPassword = ref(false);
const isLoading = ref(false);

const { signIn } = useAuth();
const router = useRouter();
const route = useRoute();

const accessNotice = computed(() => {
  const reason = Array.isArray(route.query.reason)
    ? route.query.reason[0]
    : route.query.reason;
  const legacyError = Array.isArray(route.query.error)
    ? route.query.error[0]
    : route.query.error;

  if (reason === "banned") {
    return {
      title: "Access restricted",
      description:
        "Your account has been banned. Contact an administrator if you believe this is a mistake.",
      variant: "destructive" as const,
    };
  }

  if (reason === "session-expired") {
    return {
      title: "Session expired",
      description: "Your session expired. Sign in again to continue.",
      variant: "default" as const,
    };
  }

  if (reason === "forbidden" || legacyError) {
    return {
      title: "Access denied",
      description:
        "You do not have permission to access that page. Sign in with another account if needed.",
      variant: "destructive" as const,
    };
  }

  return null;
});

const { errors, handleSubmit, defineField } = useForm({
  validationSchema: toTypedSchema(
    z.object({
      email: z.email("Invalid email address"),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long"),
      remember: z.boolean().optional(),
    }),
  ),
  initialValues: {
    email: "",
    password: "",
    remember: false,
  },
});

const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [remember, rememberAttrs] = defineField("remember");

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true;

  const { error } = await signIn(values.email, values.password);

  isLoading.value = false;

  if (error) {
    toast.error(
      error.message || "Failed to sign in. Please check your credentials.",
    );
    return;
  }

  toast.success("Successfully logged in");
  router.push("/");
});
</script>
