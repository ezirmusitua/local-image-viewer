import {Document} from 'mongoose';

export interface FileInterface {
  name: string,
  path: string,
  repoPath: string,
  parentHash: string,
  hash: string,
  isDir: boolean,
  ctime?: number,
  mimeType?: string
}

export type FileDocument = FileInterface & Document;
