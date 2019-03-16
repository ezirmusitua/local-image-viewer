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
    CollectionList.mt-3(:items="collections" :name="filter.name")
    v-divider
    v-layout.mb-4.mt-4(justify-center)
      v-pagination(
      v-model="filter.pageIndex"
      :length="pageCount"
      :limit="9"
      )
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import {State, Action, Getter} from 'vuex-class';
  import SearchPanel from '@/components/SearchPanel.vue';
  import CollectionList from '@/components/CollectionList.vue';
  import {HOME_STORE_NAME} from '@/stores/home';

  @Component({
    components: {
      CollectionList,
      SearchPanel,
    },
  })
  export default class Home extends Vue {
    @State('filter', {namespace: HOME_STORE_NAME}) public filter!: object;
    @State('collections', {namespace: HOME_STORE_NAME}) public collections!: object[];
    @Getter('pageCount', {namespace: HOME_STORE_NAME}) public pageCount!: number;
    @Action('listCollection', {namespace: HOME_STORE_NAME}) public listCollection!: any;
    @Action('checkAndCreateSession', {namespace: HOME_STORE_NAME}) public checkAndCreateSession!: any;

    @Watch('filter', {immediate: true, deep: true})
    // tslint:disable-line
    private onFilterChange(newVal, oldVal) {
      if (!oldVal) return;
      this.listCollection();
    }

    private mounted() {// tslint:disable-line
      this.checkAndCreateSession();
      this.listCollection();
    }
  }
</script>
