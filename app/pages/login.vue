<template>
  <Card>
    <CardHeader class="text-center">
      <CardTitle class="text-xl"> Welcome back </CardTitle>
      <CardDescription> Login with your email account </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel for="email">Email</FieldLabel>
            <Input
              v-model="email"
              v-bind="emailAttrs"
              id="email"
              type="email"
              placeholder="m@example.com"
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
              />
              <Button
                variant="ghost"
                size="icon"
                type="button"
                class="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
                @click="showPassword = !showPassword"
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
              />
              <Label for="remember">Remember me</Label>
            </div>
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { useForm } from "vee-validate";
import { z } from "zod";
import { toTypedSchema } from "@vee-validate/zod";

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
import { EyeIcon, EyeOffIcon } from "lucide-vue-next";

definePageMeta({
  layout: "auth",
});

useHead({ title: "Login" });

const showPassword = ref(false);

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
</script>
