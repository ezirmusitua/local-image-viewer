<style scoped lang="scss">
  .gallery-list {
    max-width: 1279px;

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
        v-layout(justify-center align-center)
          GalleryCard.card(:gallery="g")

</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State } from 'vuex-class';
  import GalleryCard from '@/components/GalleryCard.vue';
  import { HOME_STORE_NAME } from '@/stores/home';

  @Component({
    components: {GalleryCard},
  })
  export default class GalleryList extends Vue {
    @State('galleries', {namespace: HOME_STORE_NAME}) private galleries!: object[];
  }
</script>
