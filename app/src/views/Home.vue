<template lang="pug">
  div.home
    SearchPanel
    v-divider
    GalleryList.mt-3(:galleries="galleries")
    v-divider
    v-layout.mt-4(justify-center)
      v-pagination(
      v-model="pageIndex"
      :length="pageCount"
      :limit="9"
      )
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import SearchPanel from '@/components/SearchPanel.vue';
  import GalleryList from '@/components/GalleryList.vue';
  import { GalleryResource, GalleryAPIs } from '@/resources/gallery';

  const PageSize = 9;

  @Component({
    components: {
      GalleryList,
      SearchPanel,
    },
  })
  export default class Home extends Vue {
    public galleries = [];
    public galleryCount = 0;
    public name = '';
    public pageIndex = 1;
    public pageSize = PageSize;

    public get pageCount() {
      return Math.ceil(this.galleryCount / this.pageSize);
    }

    public async listGallery() {
      const {
        galleries, count,
      } = await GalleryResource.request(GalleryAPIs.LIST, {
        name: this.name,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      })
      this.galleries = galleries;
      this.galleryCount = count;
    }

    @Watch('pageIndex', {immediate: true})
    @Watch('name', {immediate: true})
    @Watch('pageSize', {immediate: true})
    private onFilterChange() {
      this.listGallery();
    }

    private mounted() {
      this.listGallery();
    }
  }
</script>
