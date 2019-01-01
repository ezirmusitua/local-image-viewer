<style scoped lang="scss">
  .gallery-card {
    width: 320px;
  }

</style>

<template lang="pug">
  router-link(:to="`/gallery/${id}`")
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
          h3.name {{ name }}
          p.count {{ fileCount }} P


</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import { concatThumbnail } from '@/resources/gallery';

  @Component
  export default class GalleryCard extends Vue {
    @Prop() public gallery!: { id?: number, name: string, fileCount: number };

    get id() {
      return this.gallery.id;
    }

    get thumbnail() {
      return concatThumbnail(this.gallery)
    }

    get name() {
      return this.gallery.name;
    }

    get fileCount() {
      return this.gallery.fileCount;
    }
  }

</script>
