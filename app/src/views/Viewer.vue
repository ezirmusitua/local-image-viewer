<style lang="scss" scoped>
</style>

<template lang="pug">
  div#scroll-target(style="height: 100vh; overflow-y: scroll")
    VerticalProgress(:progress-percentage="progressPercentage")
    v-layout(
    column
    v-scroll:#scroll-target="onScroll"
    )
      v-img(
      v-for="(i, idx) in images"
      :key="idx"
      :src="concatImage(galleryId, i)"
      )
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State, Getter, Mutation, Action } from 'vuex-class';
  import { VIEWER_STORE_NAME } from '@/stores/viewer';
  import { concatImage } from '@/resources/gallery';
  import VerticalProgress from '@/components/VerticalProgress.vue';

  const SCROLL_THRESHOLD = 1500;
  const SCROLL_TIMEOUT = 300;
  @Component({
    components: {VerticalProgress},
  })
  export default class Viewer extends Vue {
    @State('gallery', {namespace: VIEWER_STORE_NAME}) private gallery!: object;
    @State('progress', {namespace: VIEWER_STORE_NAME}) private progress!: number;
    @Getter('progressPercentage', {namespace: VIEWER_STORE_NAME}) private progressPercentage!: string;
    @Getter('images', {namespace: VIEWER_STORE_NAME}) private images!: string[];
    @Mutation('changeGalleryId', {namespace: VIEWER_STORE_NAME}) private changeId!: any;
    @Mutation('increaseProgress', {namespace: VIEWER_STORE_NAME}) private increaseProgress!: any;
    @Action('getDetail', {namespace: VIEWER_STORE_NAME}) private load!: any;
    @Action('trackSessionView', {namespace: VIEWER_STORE_NAME}) private trackView!: any;
    private scrollTimeout: any = null;
    private trackViewInterval: any = null;
    private concatImage: any = concatImage;

    get galleryId() {
      const {galleryId} = this.$route.params;
      return galleryId;
    }

    private onScroll(e: any) {
      const {scrollHeight, scrollTop} = e.target;
      if (scrollHeight - scrollTop < SCROLL_THRESHOLD) {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => {
          this.increaseProgress();
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = null;
        }, SCROLL_TIMEOUT);
      }
    }

    private autoTrackView() {
      this.trackViewInterval = setInterval(this.trackView, 30 * 1000);
    }

    private mounted() {
      this.changeId(this.galleryId);
      this.load();
      this.autoTrackView();
    }

    private beforeDestroy() {
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = null;
      clearInterval(this.trackViewInterval);
      this.trackViewInterval = null;
    }
  }
</script>
