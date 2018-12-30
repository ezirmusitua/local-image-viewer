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
      v-for="n in 9"
      :key="n"
      )
        GalleryCard.card

</template>

<script>
  import { Component, Vue } from 'vue-property-decorator';
  import GalleryCard from './GalleryCard';

  @Component({
    components: {GalleryCard},
  })
  export default class GalleryList extends Vue {}
</script>
