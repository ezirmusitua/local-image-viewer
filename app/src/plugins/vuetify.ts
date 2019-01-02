import Vue from 'vue'
import Vuetify, { directives } from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  directives: {
    Scroll: directives.Scroll,
  },
  theme: {
    accent: '#0D6626',
    error: '#DB102D',
    info: '#2196F3',
    success: '#10BD27',
    warning: '#E85F3E',
  },
  customProperties: true,
  iconfont: 'mdi',
})
