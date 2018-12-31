import joi from 'joi'
import { METHODS, RouteObject } from '@/resources/Router'
import { Resource } from '@/resources/Resource'
import { Config } from '@/Config'

const EndPoint = 'gallery';
export const GalleryAPIs = {
  LIST: 'list',
  RANDOM: 'random',
}
const Routes: RouteObject[] = [{
  method: METHODS.GET,
  name: GalleryAPIs.LIST,
  path: '',
  paramsSchema: {
    name: joi.string().allow(['']),
    pageIndex: joi.number().min(1).required(),
    pageSize: joi.number().min(9).max(21).required(),
  },
  dataSchema: {},
}, {
  method: METHODS.GET,
  name: GalleryAPIs.RANDOM,
  path: '/random',
  paramsSchema: {},
  dataSchema: {},
}];

export const GalleryResource = new Resource(EndPoint, Routes)

export function concatThumbnail(gallery: { id?: number }) {
  const {id} = gallery;
  return `${Config.backend}/${EndPoint}/thumbnail?id=${id}`;
}
