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
    src="https://picsum.photos/500/300?image=15"
    lazy-src="https://picsum.photos/10/6?image=15"
    )
    v-card-title(primary-title)
      .description
        h3.name How to create Vue app in steps
        p.count 100P


</template>

<script>
  import { Component, Vue } from 'vue-property-decorator';

  @Component({})
  export default class GalleryCard extends Vue {

  }

</script>
