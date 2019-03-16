<style lang="scss" scoped>
</style>

<template lang="pug">
  v-layout(justify-space-around wrap)
    v-flex(
    lg2
    md4
    sm12
    xs12
    v-for="(c, idx) in collectionsRecommendation"
    :key="idx"
    )
      v-layout.mb-3(align-center justify-center)
        router-link(:to="`/collection/${c._id}`")
          CollectionCard(:collection="c")

</template>

<script lang="ts">
  import {State} from 'vuex-class';
  import {Component, Vue} from 'vue-property-decorator';
  import CollectionCard from '@/components/CollectionCard.vue';
  import {VIEWER_STORE_NAME} from '@/stores/viewer';

  @Component({
    components: {
      CollectionCard,
    },
  })
  export default class GalleriesRecommendation extends Vue {
    @State('collectionsRecommendation', {namespace: VIEWER_STORE_NAME})
    private collectionsRecommendation!: object[];
  }
</script>
