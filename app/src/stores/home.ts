import { GalleryAPIs, GalleryResource } from '@/resources/gallery'

export const HOME_STORE_NAME = 'home';
export const HOME_FILTER_PAGE_SIZE = 9;

interface HomeState {
  filter: {
    name: string,
    pageSize: number,
    pageIndex: number,
  },
  galleries: object[],
  galleryCount: number,
}

const state: HomeState = {
  filter: {
    pageSize: HOME_FILTER_PAGE_SIZE,
    pageIndex: 1,
    name: '',
  },
  galleries: [],
  galleryCount: 0,
};

const getters = {
  pageCount(s: HomeState, g: object, rs: object, rg: object) {
    const {galleryCount, filter: {pageSize}} = s;
    return Math.ceil(galleryCount / pageSize);
  },
};

const mutations = {
  changeGalleries(s: HomeState, galleries: object[]) {
    s.galleries = galleries;
  },
  changeGalleryCount(s: HomeState, count: number) {
    s.galleryCount = count;
  },
  changePageIndex(s: HomeState, index: number) {
    s.filter = {...s.filter, pageIndex: index};
  },
  changeFilterName(s: HomeState, name: string) {
    s.filter = {...s.filter, name}
  },
};

const actions = {
  async listGallery({commit, state: s}: { commit: any, state: HomeState }) {
    const {filter} = s;
    const {galleries, count} = await GalleryResource.request(GalleryAPIs.LIST, filter);
    commit('changeGalleries', galleries);
    commit('changeGalleryCount', count);
  },
};

const store = {namespaced: true, state, getters, mutations, actions};

export default {[HOME_STORE_NAME]: store};
