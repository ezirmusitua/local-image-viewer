import joi from 'joi';
import { METHODS, RouteObject } from '@/resources/Router'
import { Resource } from '@/resources/Resource'

const EndPoint = 'session';
export const SessionAPIs = {
  START: 'startSession',
  VIEW_GALLERY: 'viewGallery',
}
const Routes: RouteObject[] = [{
  method: METHODS.POST,
  name: SessionAPIs.START,
  path: '',
  paramsSchema: {},
  dataSchema: {},
}, {
  method: METHODS.POST,
  name: SessionAPIs.VIEW_GALLERY,
  path: '/view/gallery/:galleryId',
  paramsSchema: {lasting: joi.number()},
  dataSchema: {},
}];

export const SessionResource = new Resource(EndPoint, Routes)
