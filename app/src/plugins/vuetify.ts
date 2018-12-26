import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  theme: {
    primary: '#1A1A1A',
    secondary: '#170E0E',
    accent: '#0D6626',
    error: '#DB102D',
    info: '#2196F3',
    success: '#10BD27',
    warning: '#E85F3E',
  },
  customProperties: true,
  iconfont: 'mdi',
})
