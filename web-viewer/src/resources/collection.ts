import joi from 'joi';
import {METHODS, RouteObject} from '@/resources/Router';
import {Resource} from '@/resources/Resource';
import {Config} from '@/Config';

const EndPoint = 'collection';
export const CollectionAPIs = {
  LIST: 'listCollection',
  RANDOM: 'listRandomCollection',
  DETAIL: 'getCollectionDetail',
  IMAGE: 'getCollectionImage',
  RECOMMEND: 'recommendCollection',
  REMOVE_COLLECTION: 'removeCollection',
};
const Routes: RouteObject[] = [{
  method: METHODS.GET,
  name: CollectionAPIs.LIST,
  path: '',
  paramsSchema: {
    name: joi.string().allow(['']),
    pageIndex: joi.number().min(1).required(),
    pageSize: joi.number().min(9).max(21).required(),
  },
  dataSchema: {},
}, {
  method: METHODS.GET,
  name: CollectionAPIs.RANDOM,
  path: '/random',
  paramsSchema: {},
  dataSchema: {},
}, {
  method: METHODS.GET,
  name: CollectionAPIs.DETAIL,
  path: '/:id',
  paramsSchema: {},
  dataSchema: {},
}, {
  method: METHODS.GET,
  name: CollectionAPIs.RECOMMEND,
  path: '/recommend',
  paramsSchema: {},
  dataSchema: {},
}, {
  method: METHODS.DELETE,
  name: CollectionAPIs.REMOVE_COLLECTION,
  path: '/:id',
  paramsSchema: {},
  dataSchema: {},
}];

export const CollectionResource = new Resource(EndPoint, Routes);

export function concatThumbnail(collection: { _id?: string }) {
  return `${Config.backend}/${EndPoint}/thumbnail?id=${collection._id}`;
}

export function concatImage(hash: string) {
  return `${Config.backend}/${EndPoint}/image/${hash}`;
}
