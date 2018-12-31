<template lang="pug">
  div.home
    SearchPanel
    v-divider
    GalleryList.mt-3(:items="galleries" :name="filter.name")
    v-divider
    v-layout.mt-4(justify-center)
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

  @Component({
    components: {
      GalleryList,
      SearchPanel,
    },
  })
  export default class Home extends Vue {
    @State('filter', {namespace: HOME_STORE_NAME}) public filter!: object;
    @State('galleries', {namespace: HOME_STORE_NAME}) public galleries!: object[];
    @Getter('pageCount', {namespace: HOME_STORE_NAME}) public pageCount!: number;
    @Action('listGallery', {namespace: HOME_STORE_NAME}) public listGallery!: any;

    @Watch('filter', {immediate: true, deep: true})
    private onFilterChange() {
      this.listGallery();
    }

    private mounted() {
      this.listGallery();
    }
  }
</script>
