<style lang="scss">
  .home {
    overflow-y: auto;
  }
</style>
<template lang="pug">
  div.home
    SearchPanel
    v-divider
    v-layout.mb-4.mt-4.md-6(justify-center)
      v-pagination(
      v-model="filter.pageIndex"
      :length="pageCount"
      :limit="9"
      )
    GalleryList.mt-3(:items="galleries" :name="filter.name")
    v-divider
    v-layout.mb-4.mt-4(justify-center)
      v-pagination(
      v-model="filter.pageIndex"
      :length="pageCount"
      :limit="9"
      )
</template>

<script lang="ts">
  import { Component, Vue, Watch } from 'vue-property-decorator';
  import { State, Action, Getter } from 'vuex-class';
  import SearchPanel from '@/components/SearchPanel.vue';
  import GalleryList from '@/components/GalleryList.vue';
  import { HOME_STORE_NAME } from '@/stores/home';
  import GalleryCard from '@/components/GalleryCard.vue';

  @Component({
    components: {
      GalleryCard,
      GalleryList,
      SearchPanel,
    },
  })
  export default class Home extends Vue {
    @State('filter', {namespace: HOME_STORE_NAME}) public filter!: object;
    @State('galleries', {namespace: HOME_STORE_NAME}) public galleries!: object[];
    @Getter('pageCount', {namespace: HOME_STORE_NAME}) public pageCount!: number;
    @Action('listGallery', {namespace: HOME_STORE_NAME}) public listGallery!: any;
    @Action('checkAndCreateSession', {namespace: HOME_STORE_NAME}) public checkAndCreateSession!: any;

    @Watch('filter', {immediate: true, deep: true})
    private onFilterChange() {
      this.listGallery();
    }

    private mounted() {
      this.checkAndCreateSession();
      this.listGallery();
    }
  }
</script>
