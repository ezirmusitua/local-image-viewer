<style scoped lang="scss">
  .gallery-list {
    max-width: 1280px;

    .card {
      margin-bottom: 20px;
    }
  }

</style>

<template lang="pug">
  v-container.gallery-list
    v-layout(wrap)
      v-flex(
      v-for="(g, idx) in galleries"
      :key="idx"
      )
        GalleryCard.card(:gallery="g")

</template>

<script>
  import { Component, Vue } from 'vue-property-decorator';
  import GalleryCard from './GalleryCard';

  @Component({
    components: {GalleryCard},
    props: {
      galleries: Array,
    }
  })
  export default class GalleryList extends Vue {}
</script>
