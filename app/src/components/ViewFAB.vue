<style lang="scss" scoped>
  .viewer-fab {
    position: fixed;
    bottom: 48px;
    right: 48px;
  }
</style>

<template lang="pug">
  div.viewer-fab
    v-menu(
    top
    offset-y
    )
      v-btn.primary-btn(slot="activator" fab)
        // TODO: try fix vuetify icon
        v-layout(align-center justify-center)
          span.title ≡
      v-list
        v-list-tile(@click="() => scrollTo('top')")
          v-list-tile-title Scroll to top
        v-list-tile(@click="() => scrollTo('middle')")
          v-list-tile-title Scroll to middle
        v-list-tile(@click="() => scrollTo('bottom')")
          v-list-tile-title Scroll to bottom
        v-list-tile
          v-list-tile-title
            router-link(to="/") Back to home

</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator';

  @Component({})
  export default class ViewFAB extends Vue {
    @Prop() private scrollTo!: any;
  }
</script>
