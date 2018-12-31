import { GalleryAPIs, GalleryResource } from '@/resources/gallery'

export const VIEWER_STORE_NAME = 'viewer';

interface ViewerState {
  galleryId: number | null,
  gallery: any,
  progress: number,
}

const state: ViewerState = {
  galleryId: null,
  gallery: {},
  progress: 0,
};

const getters = {
  images(s: ViewerState) {
    return s.gallery.files;
  },
  fileCount(s: ViewerState) {
    return s.gallery.fileCount;
  },
};

const mutations = {
  changeGallery(s: ViewerState, gallery: any) {
    s.gallery = gallery;
  },
  changeGalleryId(s: ViewerState, id: number) {
    s.galleryId = id;
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
