import {Document} from 'mongoose';

export interface CollectionInterface {
  _id?: any,
  name: string,
  path: string,
  thumbnail: string,
  fileCount?: number,
  files: { name: string }[],
  updateAt?: number,
  valid?: boolean,
}

export type CollectionDocument = CollectionInterface & Document;
