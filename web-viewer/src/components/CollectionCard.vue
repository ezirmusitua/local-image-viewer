<style scoped lang="scss">
  .collection-card {
    width: 320px;
  }

</style>

<template lang="pug">
  router-link(:to="`/collection/${id}`")
    v-card.collection-card
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
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {concatThumbnail} from '@/resources/collection';

  @Component
  export default class CollectionCard extends Vue {
    @Prop() public collection!: { _id?: string, name: string, fileCount: number };

    get id() {
      return this.collection._id;
    }

    get thumbnail() {
      return concatThumbnail(this.collection);
    }

    get name() {
      return this.collection.name;
    }

    get fileCount() {
      return this.collection.fileCount;
    }
  }

</script>
