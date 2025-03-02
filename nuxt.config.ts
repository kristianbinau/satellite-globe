// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ["@nuxt/ui", "@nuxthub/core", "@tresjs/nuxt"],

  css: ["~/assets/css/main.css"],

  future: {
    compatibilityVersion: 4,
  },

  compatibilityDate: "2024-11-27",

  hub: {
    cache: true,
  },

  tres: {
    devtools: true,
  },

  runtimeConfig: {
    ipregistryApiKey: process.env.NUXT_IPREGISTRY_API_KEY,
  },
});