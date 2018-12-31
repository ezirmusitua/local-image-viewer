import Vue from 'vue';
import Vuex from 'vuex';
import homeStore from './home';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    ...homeStore,
  },
});
