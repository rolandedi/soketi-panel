<template>
  <div class="space-y-6">
    <PageHero
      title="Applications"
      description="Manage your Soketi applications."
    >
      <Button><PlusIcon /> New application</Button>
    </PageHero>

    <!-- Stats Cards -->
    <div class="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Total Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-semibold text-foreground">1</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Active Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-semibold text-foreground">1</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle class="text-sm font-medium text-muted-foreground">
            Inactive Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="text-3xl font-semibold text-foreground">0</div>
        </CardContent>
      </Card>
    </div>

    <!-- Data Table Card -->
    <Card class="p-0">
      <div class="flex items-center justify-between p-6 pb-0">
        <div class="relative w-full max-w-sm">
          <Search
            class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          />
          <Input type="search" placeholder="Search" class="pl-9 h-9" />
        </div>
        <div class="flex items-center justify-end gap-2">
          <Select>
            <SelectTrigger class="w-36">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">
                  <ListFilter class="w-4 h-4" /> All
                </SelectItem>
                <SelectItem value="25">
                  <CheckCircle class="w-4 h-4" /> Active
                </SelectItem>
                <SelectItem value="50">
                  <XCircle class="w-4 h-4" /> Inactive
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div class="border-y border-border/50 overflow-x-auto">
        <Table class="whitespace-nowrap">
          <TableHeader>
            <TableRow class="hover:bg-transparent">
              <TableHead class="pl-3">
                <div class="px-3 py-4">
                  <Checkbox
                    class="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex items-center gap-1.5 cursor-pointer select-none text-foreground font-semibold"
                >
                  App ID
                  <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex items-center gap-1.5 cursor-pointer select-none text-foreground font-semibold"
                >
                  App Name
                  <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead class="text-foreground font-semibold">
                App Key
              </TableHead>
              <TableHead class="text-foreground font-semibold">
                App Secret
              </TableHead>
              <TableHead>
                <div
                  class="flex items-center gap-1.5 cursor-pointer select-none text-foreground font-semibold"
                >
                  Active Status
                  <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex items-center gap-1.5 cursor-pointer select-none text-foreground font-semibold"
                >
                  Creator
                  <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex items-center gap-1.5 cursor-pointer select-none text-foreground font-semibold"
                >
                  Created at
                  <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex items-center gap-1.5 cursor-pointer select-none text-foreground font-semibold"
                >
                  Updated at
                  <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead class="text-right pr-6"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell class="pl-3">
                <div class="px-3 py-4">
                  <Checkbox
                    class="border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2 text-primary font-medium">
                  1 <Copy class="w-3.5 h-3.5 cursor-pointer hover:opacity-80" />
                </div>
              </TableCell>
              <TableCell class="font-medium text-foreground">MissCI</TableCell>
              <TableCell>
                <div class="flex items-center gap-2 text-primary font-medium">
                  cc829a990444432b61eb29ba1c9c7308a
                  <Copy class="w-3.5 h-3.5 cursor-pointer hover:opacity-80" />
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2 text-primary font-medium">
                  5e465dcf017cace3280adb4345e4dcf4
                  <Copy class="w-3.5 h-3.5 cursor-pointer hover:opacity-80" />
                </div>
              </TableCell>
              <TableCell>
                <Switch
                  :checked="true"
                  class="data-[state=checked]:bg-primary"
                />
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Mar 23, 2026 07:16pm</TableCell>
              <TableCell>Mar 23, 2026 07:16pm</TableCell>
              <TableCell class="text-right pr-6">
                <Button variant="outline" size="sm" class="h-8">
                  <PencilIcon class="size-3.5" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Footer / Pagination -->
      <div
        class="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 pt-0 text-sm text-muted-foreground"
      >
        <div class="flex-1 font-medium">Showing 1 result</div>
        <div class="flex items-center space-x-3">
          <span class="font-medium text-muted-foreground">Per page</span>
          <Select>
            <SelectTrigger class="h-8 w-17.5">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts" setup>
import {
  PlusIcon,
  Search,
  ChevronDown,
  ListFilter,
  CheckCircle,
  XCircle,
  Copy,
  PencilIcon,
} from "lucide-vue-next";
import PageHero from "~/components/PageHero.vue";

useHead({ title: "Applications" });
</script>
