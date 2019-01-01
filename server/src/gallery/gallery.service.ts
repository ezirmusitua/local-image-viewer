import * as fs from 'fs';
import * as path from 'path';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Gallery } from './dto/gallery.dto';
import { database } from '../common/database';
import { AuthService } from '../auth/auth.service'
import { Session } from '../session/dto/session.dto'

const REPO = process.env.REPO;
const RANDOM_COUNT = 9;

function isImage(filename) {
  const ext = path.extname(filename);
  return ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].indexOf(ext) > -1;
}

@Injectable()
export class GalleryService {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

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

  list(query, pageIndex, pageSize): { galleries: Gallery[], count: number } {
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

  recommend(token: string): { galleries: Gallery[], count: number } {
    if (!this.authService.verify(token)) {
      throw new HttpException(
        'Invalid Session',
        HttpStatus.BAD_REQUEST,
      )
    }
    const sessionId = parseInt(this.authService.decode(token) as string, 10);
    const sessionCollection = database.getCollection('session');
    const curSession = sessionCollection.findOne({$loki: sessionId}) as Session;
    if (!curSession) {
      throw new HttpException(
        'Session not found',
        HttpStatus.NOT_FOUND,
      )
    }
    const curSessionGalleryScoreNameMap = curSession
      .galleryBrowseHistory
      .reduce((res, g) => {
        res[g.name] = g.score;
        return res;
      }, {});
    const otherSessions = sessionCollection.find({
      $loki: {$ne: sessionId},
    }) as Session[];
    const similarSessions = otherSessions.map((session) => {
      let similarity = 0;
      const history = session.galleryBrowseHistory.sort((p, n) => n.score - p.score);
      history.forEach((g) => {
        similarity += g.score / curSessionGalleryScoreNameMap[g.name] || 0;
      });
      return {...session, similarity, galleryBrowseHistory: history};
    }).sort((p, n) => n.similarity - p.similarity);
    const [galleriesNames, added] = [[], new Set([])];
    similarSessions.forEach((session) => {
      session.galleryBrowseHistory.forEach((history) => {
        if (!curSessionGalleryScoreNameMap[history.name] && !added.has(history.name)) {
          galleriesNames.push(history.name);
          added.add(history.name);
        }
      });
    })
    const galleries = database.getCollection('gallery')
      .chain()
      .find({name: {$in: galleriesNames}})
      .limit(5)
      .data()
      .map(g => ({name: g.name, thumbnail: g.thumbnail, fileCount: g.fileCount}));
    return {galleries, count: galleries.length} as any;
  }

  thumbnail(id: number): { content: Buffer, type: string } {
    const galleryCollection = database.getCollection('gallery');
    const gallery = galleryCollection.findOne({$loki: id});
    if (!gallery) throw Error(`Gallery not found`);
    const content = fs.readFileSync(gallery.thumbnail)
    const type = `image/${path.extname(gallery.thumbnail).slice(1)}`
    return {content, type};
  }

  detail(id: number) {
    const galleryCollection = database.getCollection('gallery');
    const gallery = galleryCollection.findOne({$loki: id});
    if (!gallery) throw new Error('Gallery not found');
    return gallery;
  }

  image(id: number, name: string): { content: Buffer, type: string } {
    const galleryCollection = database.getCollection('gallery');
    const gallery = galleryCollection.findOne({$loki: id});
    const image = gallery && gallery.files.find(f => f === name);
    if (!image) throw Error(`Image not found`);
    const content = fs.readFileSync(path.join(gallery.path, image));
    const type = `image/${path.extname(image).slice(1)}`
    return {content, type};
  }
}
