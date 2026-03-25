<template>
  <div class="space-y-6">
    <PageHero
      title="Playground"
      description="Test your Soketi server and applications."
    />

    <Card>
      <CardHeader>
        <CardTitle class="text-base font-semibold">
          Test Event Broadcasting
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-6">
        <div class="space-y-2">
          <Label for="application">
            Application to send<span class="text-destructive">*</span>
          </Label>
          <Select>
            <SelectTrigger id="application" class="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="app1">App 1</SelectItem>
                <SelectItem value="app2">App 2</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="space-y-2">
            <Label for="channel">
              Channel name<span class="text-destructive">*</span>
            </Label>
            <Input id="channel" />
          </div>
          <div class="space-y-2">
            <Label for="event">
              Event name<span class="text-destructive">*</span>
            </Label>
            <Input id="event" />
          </div>
        </div>

        <div class="space-y-2">
          <Label for="payload">
            Payload<span class="text-destructive">*</span>
          </Label>
          <textarea
            id="payload"
            class="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          ></textarea>
        </div>

        <Button class="w-full">
          <Send class="w-4 h-4 mr-2" />
          Send Event
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import { Send } from "lucide-vue-next";

useHead({ title: "Playground" });
</script>
