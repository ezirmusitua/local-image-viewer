import * as fs from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { Gallery } from './dto/gallery.dto';
import { database } from '../common/database';

const REPO = process.env.REPO;
const RANDOM_COUNT = 9;

function isImage(filename) {
  const ext = path.extname(filename);
  return ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].indexOf(ext) > -1;
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
      if (images.length) {
        gallery.fileCount = images.length;
        gallery.files = images;
        gallery.thumbnail = path.join(gp, images[0]);
        gallery.updateAt = Date.now()
        const existed = galleryCollection.findOne({path: gp});
        if (!existed) {
          galleryCollection.insert(gallery);
        } else {
          galleryCollection.update({...existed, ...gallery});
        }
      }
    });
  }

  async random(): Promise<{ galleries: Gallery[], count: number }> {
    const galleryCollection = database.getCollection('gallery');
    const maxId = galleryCollection.max('$loki');
    const minId = galleryCollection.min('$loki')
    const galleryIds = [];
    while (galleryIds.length !== RANDOM_COUNT) {
      const rndId = minId + Math.ceil(Math.random() * maxId - minId);
      const exists = galleryIds.find(id => id === rndId);
      if (!exists) {
        galleryIds.push(rndId);
      }
    }
    const galleries = galleryCollection.find({$loki: {$in: galleryIds}});
    return {
      galleries: galleries.map(g => ({
        id: g.$loki,
        name: g.name,
        fileCount: g.fileCount,
        thumbnail: g.thumbnail,
      })),
      count: galleries.length,
    }
  }

  async list(query, pageIndex, pageSize): Promise<{ galleries: Gallery[], count: number }> {
    const galleryCollection = database.getCollection('gallery');
    const count = galleryCollection.count(query);
    const galleries = galleryCollection
      .chain()
      .find(query)
      .simplesort('updateAt')
      .offset((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .data()
      .map(g => ({...g, id: g.$loki}));
    return {galleries, count};
  }

  thumbnail(id: number): { content: Buffer, type: string } {
    const galleryCollection = database.getCollection('gallery');
    const gallery = galleryCollection.findOne({$loki: id});
    if (!gallery) throw Error(`Gallery not found`);
    const content = fs.readFileSync(gallery.thumbnail)
    const type = `image/${path.extname(gallery.thumbnail).slice(1)}`
    return {content, type};
  }
}
