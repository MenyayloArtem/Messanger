export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,
  env : {
    api : 'http://localhost:3001/'
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'messanger-rework',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    { src: '~assets/scss/global.scss', lang: 'scss' }
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/dotenv',
    '@nuxtjs/axios',
    'nuxt-socket-io'
  ],
  io: {
    sockets: [ // Required
      { // At least one entry is required
        name: 'home',
        url: 'http://localhost:3001',
        default: true,
        vuex: {
          mutations : [
            'addMessage --> Messages/ADD_MESSAGE',
            'updateMessage --> Messages/UPDATE_MESSAGE',
            'deleteMessagesBack --> Messages/DELETE_MESSAGES',
            'updateFriends --> User/UPDATE_FRIENDS',
            'getInvation --> Chat/ADD_CHAT',
            'addMemberBack --> Chat/UPDATE_MEMBERS'
          ]
        },
        namespaces: { /* see section below */ }
      }
    ],
    server : {
      cors: {
        credentials: true,
        origin: ['http://localhost:3001'] // Array of whitelisted origin(s)
      }
    }
  },
  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3001/',
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    extend (config, { isDev, isClient }) {
 
      config.node = {
           fs: 'empty'
       }

      // ....
   }
  }
}
