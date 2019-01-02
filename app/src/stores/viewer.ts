import { GalleryAPIs, GalleryResource } from '@/resources/gallery'
import { SessionAPIs, SessionResource } from '@/resources/session'
import { SessionUtil } from '@/utils/session'

export const VIEWER_STORE_NAME = 'viewer';
export const VIEWER_ROUND_FILE_COUNT = 9;

interface ViewerState {
  galleryId: number | null,
  gallery: any,
  displayedImages: string[],
  progress: number,
  galleriesRecommendation: object[];
}

const state: ViewerState = {
  galleryId: null,
  gallery: {},
  displayedImages: [],
  progress: 0,
  galleriesRecommendation: [],
};

const getters = {
  images(s: ViewerState) {
    return s.displayedImages
  },
  fileCount(s: ViewerState) {
    return s.gallery.fileCount;
  },
  shouldLoadRecommendation(s: ViewerState) {
    return s.gallery.fileCount - s.progress * VIEWER_ROUND_FILE_COUNT < VIEWER_ROUND_FILE_COUNT;
  },
  progressPercentage(s: ViewerState) {
    return `${((s.progress * VIEWER_ROUND_FILE_COUNT) / s.gallery.fileCount) * 100}%`
  },
};

const mutations = {
  changeGallery(s: ViewerState, gallery: any) {
    s.gallery = gallery;
  },
  changeGalleryId(s: ViewerState, id: number) {
    s.galleryId = id;
  },
  changeRecommendGalleries(s: ViewerState, galleries: object[]) {
    s.galleriesRecommendation = galleries;
  },
  changeProgress(s: ViewerState, progress: number) {
    s.progress = progress;
  },
  changeDisplayedImages(s: ViewerState, newImages: string[]) {
    s.displayedImages = newImages;
  },
};

const actions = {
  async getDetail({commit, state: s}: { commit: any, state: ViewerState }) {
    const {galleryId} = s;
    const {gallery} = await GalleryResource.request(GalleryAPIs.DETAIL,
      {id: galleryId});
    commit('changeRecommendGalleries', [])
    commit('changeGallery', gallery);
    commit('changeProgress', 1);
    commit('changeDisplayedImages', gallery.files.slice(0, VIEWER_ROUND_FILE_COUNT));
  },
  increaseProgress({commit, state: s}: { commit: any, state: ViewerState }) {
    const {gallery, progress} = s;
    if (progress >= gallery.fileCount / VIEWER_ROUND_FILE_COUNT) return;
    const newProgress = progress + 1;
    commit('changeProgress', newProgress);
    commit('changeDisplayedImages',
      gallery.files.slice(0, newProgress * VIEWER_ROUND_FILE_COUNT),
    );
  },
  skipToImages({commit, state: s}: { commit: any, state: ViewerState }, position: string) {
    const {progress, displayedImages, gallery: {fileCount, files}} = s;
    let newProgress = progress;
    let newDisplayedImages = [...displayedImages];
    const middleProgress = Math.ceil(fileCount / VIEWER_ROUND_FILE_COUNT / 2);
    const bottomProgress = Math.ceil(fileCount / VIEWER_ROUND_FILE_COUNT);
    switch (position) {
      case 'bottom':
        if (progress >= bottomProgress) {
          return;
        }
        newProgress = bottomProgress;
        newDisplayedImages = displayedImages
          .concat(files.slice((bottomProgress - 1) * VIEWER_ROUND_FILE_COUNT, fileCount));
        break;
      case 'middle':
        if (progress >= middleProgress) {
          return;
        }
        newProgress = middleProgress;
        newDisplayedImages = displayedImages
          .concat(files.slice((middleProgress - 1) * VIEWER_ROUND_FILE_COUNT, middleProgress));
        break;
      case 'top':
      default:
        return;
    }
    commit('changeProgress', newProgress);
    commit('changeDisplayedImages', newDisplayedImages);
  },
  async trackSessionView({state: s}: { state: ViewerState }) {
    if (!SessionUtil.sessionStarted) {
      await SessionUtil.startSession();
    }
    await SessionResource.request(SessionAPIs.VIEW_GALLERY, {
      galleryId: s.galleryId,
      lasting: 30 * 1000,
    });
  },
  async loadRecommendation({commit}: { commit: any }) {
    const {galleries} = await GalleryResource.request(GalleryAPIs.RECOMMEND);
    commit('changeRecommendGalleries', galleries);
  },
}

const store = {namespaced: true, state, getters, mutations, actions};

export default {[VIEWER_STORE_NAME]: store};
