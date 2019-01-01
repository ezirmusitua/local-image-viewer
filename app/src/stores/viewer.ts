import { GalleryAPIs, GalleryResource } from '@/resources/gallery'

export const VIEWER_STORE_NAME = 'viewer';
export const VIEWER_ROUND_FILE_COUNT = 9;

interface ViewerState {
  galleryId: number | null,
  gallery: any,
  progress: number,
}

const state: ViewerState = {
  galleryId: null,
  gallery: {},
  progress: 1,
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
  progressPercentage(s: ViewerState) {
    return s.progress / s.gallery.fileCount
  },
};

const mutations = {
  changeGallery(s: ViewerState, gallery: any) {
    s.gallery = gallery;
  },
  changeGalleryId(s: ViewerState, id: number) {
    s.galleryId = id;
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
};

const store = {namespaced: true, state, getters, mutations, actions};

export default {[VIEWER_STORE_NAME]: store};
