import {CollectionAPIs, CollectionResource} from '@/resources/collection';
import {SessionAPIs, SessionResource} from '@/resources/session';
import {SessionUtil} from '@/utils/session';

export const VIEWER_STORE_NAME = 'viewer';
export const VIEWER_ROUND_FILE_COUNT = 9;

interface ViewerState {
  collectionId: number | null,
  collection: any,
  displayedImages: string[],
  progress: number,
  collectionsRecommendation: object[];
}

const state: ViewerState = {
  collectionId: null,
  collection: {},
  displayedImages: [],
  progress: 0,
  collectionsRecommendation: [],
};

const getters = {
  isVideo(s: ViewerState) {
    return s.collection.category === 'video';
  },
  videoHash(s: ViewerState) {
    console.log(s.collection);
    return s.collection.hash;
  },
  videoType(s: ViewerState) {
    return s.collection.mimeType;
  },
  images(s: ViewerState) {
    return s.displayedImages;
  },
  imageCount(s: ViewerState) {
    return s.collection.imageCount;
  },
  shouldLoadRecommendation(s: ViewerState) {
    return s.collection.imageCount - s.progress * VIEWER_ROUND_FILE_COUNT < VIEWER_ROUND_FILE_COUNT;
  },
  progressPercentage(s: ViewerState) {
    return `${((s.progress * VIEWER_ROUND_FILE_COUNT) / s.collection.imageCount) * 100}%`;
  },
};

const mutations = {
  changeCollection(s: ViewerState, collection: any) {
    s.collection = collection;
  },
  changeCollectionId(s: ViewerState, id: number) {
    s.collectionId = id;
  },
  changeRecommendCollections(s: ViewerState, galleries: object[]) {
    s.collectionsRecommendation = galleries;
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
    const {collectionId} = s;
    const {collection} = await CollectionResource.request(CollectionAPIs.DETAIL, {id: collectionId});
    commit('changeRecommendCollections', []);
    commit('changeCollection', collection);
    commit('changeProgress', 1);
    commit('changeDisplayedImages', collection.images.slice(0, VIEWER_ROUND_FILE_COUNT));
  },
  increaseProgress({commit, state: s}: { commit: any, state: ViewerState }) {
    const {collection, progress} = s;
    if (progress >= collection.imageCount / VIEWER_ROUND_FILE_COUNT) {
      return;
    }
    const newProgress = progress + 1;
    commit('changeProgress', newProgress);
    commit('changeDisplayedImages',
      collection.images.slice(0, newProgress * VIEWER_ROUND_FILE_COUNT),
    );
  },
  skipToImages({commit, state: s}: { commit: any, state: ViewerState }, position: string) {
    const {progress, displayedImages, collection: {imageCount, images}} = s;
    let newProgress = progress;
    let newDisplayedImages = [...displayedImages];
    const middleProgress = Math.ceil(imageCount / VIEWER_ROUND_FILE_COUNT / 2);
    const bottomProgress = Math.ceil(imageCount / VIEWER_ROUND_FILE_COUNT);
    switch (position) {
      case 'bottom':
        if (progress >= bottomProgress) {
          return;
        }
        newProgress = bottomProgress;
        newDisplayedImages = displayedImages
          .concat(images.slice((bottomProgress - 1) * VIEWER_ROUND_FILE_COUNT, imageCount));
        break;
      case 'middle':
        if (progress >= middleProgress) {
          return;
        }
        newProgress = middleProgress;
        newDisplayedImages = displayedImages
          .concat(images.slice((middleProgress - 1) * VIEWER_ROUND_FILE_COUNT, middleProgress));
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
    await SessionResource.request(SessionAPIs.VIEW_COLLECTION, {
      collectionId: s.collectionId,
      lasting: 30 * 1000,
    });
  },
  async loadRecommendation({commit}: { commit: any }) {
    const {galleries} = await CollectionResource.request(CollectionAPIs.RECOMMEND);
    commit('changeRecommendCollections', galleries);
  },
  async removeCollection({commit, state: _s}: { commit: any, state: any }) {
    await CollectionResource.request(CollectionAPIs.REMOVE_COLLECTION, {id: _s.collection._id});
  },
};

const store = {namespaced: true, state, getters, mutations, actions};

export default {[VIEWER_STORE_NAME]: store};
