<style lang="scss" scoped>
  .full-size {
    width: 100%;
    height: 100%;
  }

  .search-panel {
    height: 320px;
    width: 1280px;
    .container {
      height: 100%;
      width: 100%;
    }

    .input {
      width: 100%;
    }

    .actions {
      width: 100%;
    }

    .button {
      width: 100%;
    }
  }
</style>

<template lang="pug">
  v-container.search-panel
    v-layout.container(align-center justify-center)
      v-flex(lg6 md8 sm10 xs12)
        h4.display-1 View Images In Your Computer
        v-form.form
          v-layout(column align-center)
            v-text-field.input.headline(
            single-line
            clearable
            height="48"
            placeholder="search gallery name"
            )
            v-layout.actions(justify-space-around)
              v-flex(lg4)
                v-btn.button(color="info") Search Now
              v-flex(lg4)
                v-btn.button(color="info") Random
</template>

<script>
  import { Component, Vue } from 'vue-property-decorator';
  import GalleryCard from './GalleryCard';

  @Component({
    components: {GalleryCard},
  })
  export default class SearchPanel extends Vue {
  }
</script>
