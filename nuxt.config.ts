// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  ssr: false,

  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@vite-pwa/nuxt",
  ],

  srcDir: "app/",

  // Configuração do servidor dev
  devServer: {
    port: 3001,
    host: "0.0.0.0", // Permite acesso pela rede local
  },

  // Configuração do Supabase
  supabase: {
    url: process.env.NUXT_PUBLIC_SUPABASE_URL,
    key: process.env.NUXT_PUBLIC_SUPABASE_KEY,
    cookieOptions: {
      secure: false, // Para desenvolvimento HTTP
      sameSite: "lax",
    },
    clientOptions: {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
        storage:
          typeof window !== "undefined" ? window.localStorage : undefined,
      },
    },
    redirectOptions: {
      login: "/login",
      callback: "/confirm",
      exclude: ["/", "/login", "/recuperar-senha", "/redefinir-senha"],
    },
  },

  // Configuração PWA
  pwa: {
    registerType: "autoUpdate",
    workbox: {
      navigateFallback: "/",
      globPatterns: ["**/*.{js,css,html,png,svg,ico}"],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: "module",
    },
    manifest: {
      name: "Sistema de Portaria",
      short_name: "Portaria",
      description: "Sistema de controle de entrada e saída",
      theme_color: "#f97316",
      background_color: "#ffffff",
      display: "standalone",
      orientation: "portrait",
      scope: "/",
      start_url: "/",
      icons: [
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
        {
          src: "/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
          purpose: "any",
        },
        {
          src: "/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any",
        },
      ],
    },
  },

  // Configurações CSS
  css: ["@/assets/css/main.css"],

  // Otimizações de build
  nitro: {
    compressPublicAssets: true,
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["vue", "vue-router"],
            charts: ["chart.js", "vue-chartjs"],
            utils: ["date-fns", "lodash-es"],
          },
        },
      },
    },
  },
});
