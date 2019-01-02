import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/views/Home.vue';
import Viewer from '@/views/Viewer.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {
        breadcrumb: [{
          text: 'Home',
          disabled: true,
          href: '/',
        }],
      },
    },
    {
      path: '/gallery/:galleryId',
      name: 'GalleryViewer',
      component: Viewer,
      meta: {
        breadcrumb: [{
          text: 'Home',
          disabled: false,
          href: '/',
        }, {
          text: 'Viewer',
          disabled: true,
          href: '/gallery/',
        }],
      },

    },
  ],
});
