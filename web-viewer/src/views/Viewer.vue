<style lang="scss" scoped>
  #scroll-target {
    padding-top: 64px;
  }
</style>

<template lang="pug">
  div#scroll-target(style="height: 100vh; overflow-y: scroll" ref="scrollTarget")
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
    v-divider.mt-4.mb-4
    GalleriesRecommendation
    ViewFAB(:scrollTo="scrollTo")

</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import { State, Getter, Mutation, Action } from 'vuex-class';
  import { VIEWER_STORE_NAME } from '@/stores/viewer';
  import { concatImage } from '@/resources/gallery';
  import VerticalProgress from '@/components/VerticalProgress.vue';
  import GalleryCard from '@/components/GalleryCard.vue';
  import GalleriesRecommendation from '@/components/GalleriesRecommendation.vue';
  import ViewFAB from '@/components/ViewFAB.vue';

  const SCROLL_THRESHOLD = 1500;
  const SCROLL_TIMEOUT = 300;
  @Component({
    components: {
      ViewFAB,
      GalleriesRecommendation,
      GalleryCard,
      VerticalProgress,
    },
  })
  export default class Viewer extends Vue {
    @State('gallery', {namespace: VIEWER_STORE_NAME})
    private gallery!: object;
    @State('progress', {namespace: VIEWER_STORE_NAME})
    private progress!: number;
    @Getter('progressPercentage', {namespace: VIEWER_STORE_NAME})
    private progressPercentage!: string;
    @Getter('images', {namespace: VIEWER_STORE_NAME})
    private readonly images!: string[];
    @Getter('fileCount', {namespace: VIEWER_STORE_NAME})
    private readonly imageCount!: number;
    @Getter('shouldLoadRecommendation', {namespace: VIEWER_STORE_NAME})
    private shouldLoadRecommendation!: boolean;
    @Mutation('changeGalleryId', {namespace: VIEWER_STORE_NAME})
    private changeId!: any;
    @Action('increaseProgress', {namespace: VIEWER_STORE_NAME})
    private increaseProgress!: any;
    @Action('getDetail', {namespace: VIEWER_STORE_NAME})
    private load!: any;
    @Action('trackSessionView', {namespace: VIEWER_STORE_NAME})
    private trackView!: any;
    @Action('loadRecommendation', {namespace: VIEWER_STORE_NAME})
    private recommend!: any;
    @Action('skipToImages', {namespace: VIEWER_STORE_NAME})
    private skipToImages!: any;
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
          if (this.shouldLoadRecommendation) {
            this.recommend();
          }
          clearTimeout(this.scrollTimeout);
          this.scrollTimeout = null;
        }, SCROLL_TIMEOUT);
      }
    }

    private scrollTo(position: string) {
      const scrollTarget = this.$refs.scrollTarget as any;
      this.skipToImages(position);
      let waitImageTimeout: any = setTimeout(() => {
        switch (position) {
          case 'bottom':
            scrollTarget.scrollTop = scrollTarget.scrollHeight;
            this.recommend();
            break;
          case 'middle':
            scrollTarget.scrollTop = scrollTarget.scrollHeight / 2;
            break;
          case 'top':
          default:
            scrollTarget.scrollTop = 0;
            break;
        }
        clearTimeout(waitImageTimeout);
        waitImageTimeout = null;
      }, 1500);
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
