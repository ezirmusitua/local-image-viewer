<style scoped lang="scss">
  .collection-list {
    max-width: 1279px;

    .card {
      margin-bottom: 20px;
    }
  }
</style>

<template lang="pug">
  v-container.collection-list
    v-layout(wrap)
      v-flex(
      v-for="(c, idx) in collections"
      :key="idx"
      )
        v-layout(justify-center align-center)
          CollectionCard.card(:collection="c")

</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {State} from 'vuex-class';
  import CollectionCard from '@/components/CollectionCard.vue';
  import {HOME_STORE_NAME} from '@/stores/home';

  @Component({
    components: {CollectionCard},
  })
  export default class CollectionList extends Vue {
    @State('collections', {namespace: HOME_STORE_NAME}) private collections!: object[];
  }
</script>
