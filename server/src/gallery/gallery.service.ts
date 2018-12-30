import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { Gallery } from './dto/gallery.dto';
import { database } from '../common/database';

const REPO = process.env.REPO;

function isImage(filename) {
  const ext = path.extname(filename);
  return ['.png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].indexOf(ext) > -1;
}

@Injectable()
export class GalleryService {
  async upsertRepo(): Promise<void> {
    const galleryCollection = database.getCollection('gallery');
    const galleryPaths = fs.readdirSync(REPO)
      .map(f => ({path: path.join(REPO, f), name: f}))
      .filter(({path: fp}) => fs.statSync(fp).isDirectory());
    galleryPaths.forEach(({name, path: gp}) => {
      const gallery = {name, path: gp} as any;
      const images = fs.readdirSync(gp)
        .filter(f => isImage(f));
      gallery.fileCount = images.length;
      gallery.files = images;
      gallery.updateAt = Date.now()
      const existed = galleryCollection.findOne({path: gp});
      if (!existed) {
        galleryCollection.insert(gallery);
      } else {
        galleryCollection.update({...existed, ...gallery});
      }
    });
  }

  async findAll(name: string = ''): Promise<{ galleries: Gallery[], count: number }> {
    const gallery = database.getCollection('gallery');
    const galleries = gallery.find({name});
    return {galleries, count: galleries.length};
  }
}
