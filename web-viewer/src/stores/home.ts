import {CollectionAPIs, CollectionResource} from '@/resources/collection';
import {SessionUtil} from '@/utils/session';

export const HOME_STORE_NAME = 'home';
export const HOME_FILTER_PAGE_SIZE = 9;

interface HomeState {
  filter: {
    name: string,
    pageSize: number,
    pageIndex: number,
  },
  collections: object[],
  collectionCount: number,
}

const state: HomeState = {
  filter: {
    pageSize: HOME_FILTER_PAGE_SIZE,
    pageIndex: 1,
    name: '',
  },
  collections: [],
  collectionCount: 0,
};

const getters = {
  pageCount(s: HomeState) {
    const {collectionCount, filter: {pageSize}} = s;
    return Math.ceil(collectionCount / pageSize);
  },
};

const mutations = {
  changeCollections(s: HomeState, collections: object[]) {
    s.collections = collections;
  },
  changeCollectionCount(s: HomeState, count: number) {
    s.collectionCount = count;
  },
  changePageIndex(s: HomeState, index: number) {
    s.filter = {...s.filter, pageIndex: index};
  },
  changeFilterName(s: HomeState, name: string) {
    s.filter = {...s.filter, name};
  },
};

const actions = {
  async listCollection({commit, state: s}: { commit: any, state: HomeState }) {
    console.debug('call list collection in home');
    const {filter} = s;
    const {items, totalCount} = await CollectionResource.request(CollectionAPIs.LIST, filter);
    commit('changeCollections', items);
    commit('changeCollectionCount', totalCount);
  },
  async checkAndCreateSession() {
    if (!SessionUtil.sessionStarted) {
      await SessionUtil.startSession();
    }
  },
};

const store = {namespaced: true, state, getters, mutations, actions};

export default {[HOME_STORE_NAME]: store};
