<style lang="scss" scoped>
</style>

<template lang="pug">
  v-layout(justify-space-around wrap)
    v-flex(
    lg2
    md4
    sm12
    xs12
    v-for="(g, idx) in galleriesRecommendation"
    :key="idx"
    )
      v-layout.mb-3(align-center justify-center)
        router-link(:to="`/gallery/${g.id}`")
          GalleryCard(:gallery="g")

</template>

<script lang="ts">
  import { State } from 'vuex-class';
  import { Component, Vue } from 'vue-property-decorator';
  import GalleryCard from '@/components/GalleryCard.vue';
  import { VIEWER_STORE_NAME } from '@/stores/viewer';

  @Component({
    components: {
      GalleryCard,
    },
  })
  export default class GalleriesRecommendation extends Vue {
    @State('galleriesRecommendation', {namespace: VIEWER_STORE_NAME})
    private galleriesRecommendation!: object[];
  }
</script>
