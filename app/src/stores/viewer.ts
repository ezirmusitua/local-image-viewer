import { GalleryAPIs, GalleryResource } from '@/resources/gallery'
import { SessionAPIs, SessionResource } from '@/resources/session'

export const VIEWER_STORE_NAME = 'viewer';
export const VIEWER_ROUND_FILE_COUNT = 9;

interface ViewerState {
  galleryId: number | null,
  gallery: any,
  progress: number,
  galleriesRecommendation: object[];
}

const state: ViewerState = {
  galleryId: null,
  gallery: {},
  progress: 1,
  galleriesRecommendation: [],
};

const getters = {
  images(s: ViewerState) {
    if (!s.gallery.files) {
      return [];
    }
    return s.gallery.files.slice(0, s.progress * VIEWER_ROUND_FILE_COUNT);
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
  increaseProgress(s: ViewerState) {
    s.progress += 1;
  },
};

const actions = {
  async getDetail({commit, state: s}: { commit: any, state: ViewerState }) {
    const {galleryId} = s;
    const {gallery} = await GalleryResource.request(GalleryAPIs.DETAIL,
      {id: galleryId});
    commit('changeGallery', gallery);
  },
  async trackSessionView({state: s}: { state: ViewerState }) {
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
