import {Document} from 'mongoose';

interface SessionInterface {
  _id: any,
  activateAt?: number,
  collectionBrowseHistory: {
    name: string,
    imageCount: number,
    lasting: number,
    score: number,
  }[]
}

export type SessionDocument = SessionInterface & Document;
