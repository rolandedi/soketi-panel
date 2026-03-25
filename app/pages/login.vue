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
            <FieldLabel for="email"> Email </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
          </Field>
          <Field>
            <FieldLabel for="password"> Password </FieldLabel>
            <Input id="password" type="password" required />
          </Field>
          <Field>
            <Checkbox id="remember" />
            <FieldLabel for="remember"> Remember me </FieldLabel>
          </Field>
          <Field>
            <Button type="submit"> Login </Button>
          </Field>
        </FieldGroup>
      </form>
    </CardContent>
  </Card>
</template>

<script lang="ts" setup>
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

definePageMeta({
  layout: "auth",
});

useHead({ title: "Login" });
</script>
