<template lang="pug">
  div.home
    SearchPanel
    v-divider
    GalleryList(:galleries="galleries")
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import SearchPanel from '../components/SearchPanel.vue';
  import GalleryList from '../components/GalleryList.vue';
  import { GalleryResource, GalleryAPIs } from '@/resources/gallery';

  @Component({
    components: {
      GalleryList,
      SearchPanel,
    },
  })
  export default class Home extends Vue {
    galleries = [];
    galleryCount = 0;

    mounted() {
      this.debug();
    }

    async debug() {
      const {galleries, count} = await GalleryResource.request(GalleryAPIs.RANDOM)
      this.galleries = galleries;
      this.galleryCount = count;
    }
  }
</script>
