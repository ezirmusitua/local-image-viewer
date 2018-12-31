<style scoped lang="scss">
  .gallery-card {
    width: 320px;
  }

</style>

<template lang="pug">
  v-card.gallery-card
    v-img.thumbnail(
    height="340"
    alt="thumbnail"
    aspect-ratio="1"
    class="grey lighten-2"
    :src="thumbnail"
    )
    v-card-title(primary-title)
      .description
        h3.name {{ gallery.name }}
        p.count {{ gallery.fileCount }} P


</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { concatThumbnail } from '@/resources/gallery';

  @Component
  export default class GalleryCard extends Vue {
    @Prop() public gallery: { id?: number } = {};

    get thumbnail() {
      return concatThumbnail(this.gallery)
    }
  }

</script>
