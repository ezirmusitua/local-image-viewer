import {Document} from 'mongoose';
import {FileInterface} from './file.interface';

export enum CollectionCategory {
  GALLERY = 'gallery',
  VIDEO = 'video'
}

export interface CollectionInterface {
  _id?: any,
  hash: string,
  name: string,
  category: CollectionCategory,
  path: string,
  thumbnail?: string,
  imageCount?: number,
  images?: string[],
  updateAt?: number,
  valid?: boolean,
}

export type CollectionDocument = CollectionInterface & Document;

export function createCollectionFromFile(
  category: CollectionCategory,
  file: FileInterface,
  images?: FileInterface[],
) {
  return {
    hash: file.hash,
    name: file.name,
    category,
    path: file.path,
    thumbnail: images && images.length ? images[0].hash : '',
    imageCount: images ? images.length : 0,
    images: images ? images.map(i => i.hash) : [],
    updateAt: file.ctime,
    valid: true,
  };
}
