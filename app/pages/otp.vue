<template>
  <Card>
    <CardHeader>
      <CardTitle>Enter verification code</CardTitle>
      <CardDescription>
        We sent a {{ maxLength }}-digit code to your email.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form>
        <FieldGroup>
          <Field>
            <FieldLabel for="otp"> Verification code </FieldLabel>
            <InputOTP id="otp" v-model="otp" :maxlength="maxLength" required>
              <InputOTPGroup
                class="gap-2.5 w-full justify-between *:data-[slot=input-otp-slot]:rounded-md *:data-[slot=input-otp-slot]:border"
              >
                <InputOTPSlot :index="0" />
                <InputOTPSlot :index="1" />
                <InputOTPSlot :index="2" />
                <div v-if="maxLengthPair" class="text-center">-</div>
                <InputOTPSlot :index="3" />
                <InputOTPSlot :index="4" />
                <InputOTPSlot :index="5" />
              </InputOTPGroup>
            </InputOTP>
            <FieldDescription>
              Enter the {{ maxLength }}-digit code sent to your email.
            </FieldDescription>
          </Field>
          <FieldGroup>
            <Button type="submit"> Verify </Button>
            <FieldDescription class="text-center">
              Didn't receive the code? <a href="#">Resend</a>
            </FieldDescription>
          </FieldGroup>
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
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

definePageMeta({
  layout: "auth",
});

useHead({ title: "OTP" });

const maxLength = 6;
const otp = ref("");

const maxLengthPair = computed(() => maxLength / 2);
</script>
