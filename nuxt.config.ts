// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  typescript: {
    typeCheck: true,
  },

  devtools: { enabled: true },
  modules: ["@nuxt/eslint"],
});