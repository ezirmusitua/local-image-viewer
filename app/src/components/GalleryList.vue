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

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';
  import GalleryCard from '@/components/GalleryCard.vue';

  @Component({
    components: {GalleryCard},
  })
  export default class GalleryList extends Vue {
    @Prop() private galleries: object[] = [];
  }
</script>
