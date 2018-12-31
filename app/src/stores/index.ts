import Vue from 'vue';
import Vuex from 'vuex';
import home from '@/stores/home';
import viewer from '@/stores/viewer'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ...home,
    ...viewer,
  },
});
