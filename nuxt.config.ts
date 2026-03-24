import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  typescript: {
    typeCheck: true,
  },

  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "shadcn-nuxt"],

  css: ["~/assets/css/tailwind.css"],
  vite: {
    plugins: [tailwindcss()],
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: "@/components/ui",
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL || "sqlite://./data.db",
    soketiAppId: process.env.SOKETI_APP_ID,
    soketiKey: process.env.SOKETI_KEY,
    soketiSecret: process.env.SOKETI_SECRET,
    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    public: {
      soketiHost: process.env.SOKETI_HOST || "127.0.0.1",
      soketiPort: process.env.SOKETI_PORT || "6001",
    },
  },
});
