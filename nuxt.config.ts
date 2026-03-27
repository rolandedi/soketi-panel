import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  app: {
    head: {
      title: "Soketi Panel", // default fallback title
      htmlAttrs: {
        lang: "en",
      },
      meta: [{ name: "robots", content: "noindex, nofollow" }],
      link: [{ rel: "icon", type: "image/png", href: "/favicon.png" }],
    },
  },

  compatibilityDate: "2025-07-15",
  colorMode: {
    classSuffix: "",
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "vue-sonner/nuxt",
  ],
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
    appName: process.env.APP_NAME || "Soketi Panel",
    appUrl: process.env.APP_URL || "http://localhost:3000",

    betterAuthSecret: process.env.BETTER_AUTH_SECRET,
    betterAuthUrl: process.env.BETTER_AUTH_URL,

    dbDriver: process.env.DB_DRIVER,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbName: process.env.DB_NAME,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,

    soketiMetricsHost: process.env.SOKETI_METRICS_HOST || "127.0.0.1",
    soketiMetricsPort: process.env.SOKETI_METRICS_PORT || "9601",

    pusherAppCluster: process.env.PUSHER_APP_CLUSTER,
    pusherHost: process.env.PUSHER_HOST || "127.0.0.1",
    pusherPort: process.env.PUSHER_PORT || "6001",
    pusherScheme: process.env.PUSHER_SCHEME || "http",
    pusherTls: process.env.PUSHER_TLS || "0",

    public: {
      betterAuthUrl: process.env.BETTER_AUTH_URL,
      soketiHost: process.env.SOKETI_HOST || "127.0.0.1",
      soketiPort: process.env.SOKETI_PORT || "6001",
      pusherAppCluster: process.env.PUSHER_APP_CLUSTER,
      pusherHost: process.env.PUSHER_HOST || "127.0.0.1",
      pusherPort: process.env.PUSHER_PORT || "6001",
      pusherScheme: process.env.PUSHER_SCHEME || "http",
      pusherTls: process.env.PUSHER_TLS || "0",
    },
  },
});
