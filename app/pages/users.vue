<template>
  <div class="space-y-6">
    <PageHero title="Users" description="Manage your Soketi Panel users.">
      <Button><PlusIcon /> New user</Button>
    </PageHero>

    <Card class="p-0">
      <!-- Search Input Header -->
      <div class="flex items-center justify-between p-6 pb-0">
        <div class="relative w-full max-w-sm">
          <Search
            class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
          />
          <Input type="search" placeholder="Search" class="pl-9 h-9" />
        </div>
        <div>
          <Button><PlusIcon /> New user</Button>
        </div>
      </div>

      <!-- Users Table -->
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
              <TableHead class="w-37.5">
                <div
                  class="flex items-center gap-1.5 cursor-pointer select-none text-foreground font-semibold"
                >
                  Name <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead>
                <div
                  class="flex items-center gap-1.5 cursor-pointer select-none text-foreground font-semibold"
                >
                  Email
                  <ChevronDown class="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </TableHead>
              <TableHead class="text-foreground font-semibold"
                >Is active</TableHead
              >
              <TableHead class="text-foreground font-semibold"
                >Is admin</TableHead
              >
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
              <TableCell class="font-medium">Admin</TableCell>
              <TableCell>admin@email.com</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-2 py-0.5 shadow-none font-medium"
                >
                  Yes
                </Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  class="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none px-2 py-0.5 shadow-none font-medium"
                >
                  Yes
                </Badge>
              </TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Mar 23, 2026 07:16pm</TableCell>
              <TableCell>Mar 23, 2026 07:16pm</TableCell>
              <TableCell class="text-right pr-6">
                <Button variant="outline" size="sm" class="h-8">
                  <Pencil class="h-3.5 w-3.5" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Table Footer / Pagination -->
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
                <SelectItem value="20">20</SelectItem>
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
import { PlusIcon, Search, ChevronDown, Pencil } from "lucide-vue-next";
import PageHero from "~/components/PageHero.vue";

useHead({ title: "Users" });
</script>
