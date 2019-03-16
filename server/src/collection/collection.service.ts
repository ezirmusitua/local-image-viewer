import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {AuthService} from '../auth/auth.service';
import {CollectionDocument} from './collection.interface';
import {SessionDocument} from '../session/session.interface';

const REPO = process.env.REPO;
const RANDOM_COUNT = 9;

function isImage(filename) {
  const ext = path.extname(filename);
  return ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'].indexOf(ext) > -1;
}

function rmCollectionFolder(gp) {
  return new Promise((resolve, reject) => rimraf(gp, (err) => {
    if (err) return reject(err);
    return resolve(true);
  }));
}

@Injectable()
export class CollectionService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel('Collection') private readonly collectionModel: Model<CollectionDocument>,
    @InjectModel('Session') private readonly sessionModel: Model<SessionDocument>,
  ) {
  }

  private static wrapCollectionListReturn(collection) {
    return {
      _id: collection._id,
      name: collection.name,
      fileCount: collection.fileCount,
      thumbnail: collection.thumbnail,
    };
  }

  async loadFromRepo() {
    console.info('Start Loading From REPO: ', REPO);
    const collectionPaths = fs.readdirSync(REPO)
      .reduce((res, f) => {
        const fp = path.join(REPO, f);
        const isDir = fs.statSync(fp).isDirectory();
        if (!isDir) return res;
        const dirContent = fs.readdirSync(fp);
        const subDirs = dirContent
          .filter(sf => fs.statSync(path.join(fp, sf)).isDirectory())
          .map(sf => ({
            path: path.join(fp, sf),
            name: sf,
          }));
        res.concat(subDirs);
        if (subDirs.length !== dirContent.length) {
          res.push({path: fp, name: f});
        }
        return res;
      }, []);
    console.info('Total Collections Count: ', collectionPaths.length);
    const upsertPromises = collectionPaths.reduce((promises, {name, path: gp}) => {
      const collection = {name, path: gp} as any;
      const images = fs.readdirSync(gp)
        .filter(f => isImage(f)).map(f => ({name: f}));
      if (images.length) {
        collection.fileCount = images.length;
        collection.files = images;
        collection.thumbnail = path.join(gp, images[0].name);
        collection.valid = true;
        collection.updateAt = Date.now();
        promises.push(this
          .collectionModel
          .findOneAndUpdate({path: gp}, {$set: collection}, {upsert: true})
          .exec());
      }
      return promises;
    }, []);
    await Promise.all(upsertPromises);
  }

  async random() {
    const totalCount = await this.collectionModel.count({valid: true}).exec();
    const set = new Set();
    while (set.size < RANDOM_COUNT) {
      set.add(Math.floor(Math.random() * totalCount));
    }
    const promises = [];
    for (const pos of set.values()) {
      promises.push(this.collectionModel.findOne({valid: true}).skip(pos).lean().exec());
    }
    const collections = await Promise.all(promises);
    return {
      items: collections.map(CollectionService.wrapCollectionListReturn),
      count: collections.length,
    };
  }

  async list(query, pageIndex, pageSize) {
    const totalCount = await this.collectionModel.count({...(query || {}), valid: true}).exec();
    const collections = await this.collectionModel
      .find({...(query || {}), valid: true}, {_id: 1, name: 1, thumbnail: 1, fileCount: 1})
      .sort({updateAt: -1})
      .skip((pageIndex - 1) * pageSize)
      .limit(pageSize)
      .lean()
      .exec();
    return {items: collections, totalCount};
  }

  async recommend(token: string) {
    if (!this.authService.verify(token)) {
      throw new HttpException('Invalid Session', HttpStatus.BAD_REQUEST);
    }
    const sessionId = this.authService.decode(token);
    const curSession = await this.sessionModel.findById(sessionId).lean().exec();
    if (!curSession) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    const curSessionCollectionScoreNameMap = curSession
      .collectionBrowseHistory
      .reduce((res, g) => {
        res[g.name] = g.score;
        return res;
      }, {});
    const otherSessions = await this.sessionModel.find({_id: {$ne: sessionId}}).lean().exec();
    const similarSessions = otherSessions.map((session) => {
      let similarity = 0;
      const history = session.collectionBrowseHistory.sort((p, n) => n.score - p.score);
      history.forEach((g) => {
        similarity += g.score / curSessionCollectionScoreNameMap[g.name] || 0;
      });
      return {...session, similarity, collectionBrowseHistory: history};
    }).sort((p, n) => n.similarity - p.similarity);
    const [collectionNames, added] = [[], new Set([])];
    similarSessions.forEach((session) => {
      session.collectionBrowseHistory.forEach((history) => {
        if (!curSessionCollectionScoreNameMap[history.name] && !added.has(history.name)) {
          collectionNames.push(history.name);
          added.add(history.name);
        }
      });
    });
    const collections = await this.collectionModel
      .find({
        name: {$in: collectionNames},
        valid: true,
      }, {_id: 1, name: 1, thumbnail: 1, fileCount: 1})
      .limit(5)
      .lean()
      .exec();
    return {items: collections, count: collections.length} as any;
  }

  async thumbnail(id: string) {
    const collection = await this
      .collectionModel
      .findOne({_id: id, valid: true}, {thumbnail: 1})
      .lean()
      .exec();
    if (!collection) throw Error(`Collection not found`);
    const content = fs.readFileSync(collection.thumbnail);
    const type = `image/${path.extname(collection.thumbnail).slice(1)}`;
    return {content, type};
  }

  async detail(id: string) {
    const collection = await this
      .collectionModel
      .findOne({_id: id, valid: true}).lean().exec();
    if (!collection) throw new Error('Collection not found');
    return {collection};
  }

  async image(id: string, name: string) {
    const collection = await this.collectionModel.findOne({
      _id: id,
      valid: true,
    }, {
      path: 1,
      files: 1,
    }).lean().exec();
    const image = collection && collection.files.find(f => f.name === name);
    if (!image) throw Error(`Image not found`);
    const content = fs.readFileSync(path.join(collection.path, image.name));
    const type = `image/${path.extname(image.name).slice(1)}`;
    return {content, type};
  }

  async removeCollection(id: string) {
    await this.collectionModel.findOneAndUpdate({_id: id}, {$set: {valid: false}});
    return {status: 'success'};
  }

  async clearInvalid() {
    const collections = await this.collectionModel.find().lean().exec();
    const invalidCollections = collections.reduce((result, collection) => {
      const exists = fs.existsSync(collection.path);
      if (exists && collection.valid) return result;
      return result.concat([collection]);
    }, []);
    const length = Math.ceil(invalidCollections.length / 20);
    for (const r of Array.from({length}).map((_v, k) => k)) {
      const promises = invalidCollections.slice(r, (r + 1) * 20).map((g) => rmCollectionFolder(g.path));
      await Promise.all(promises);
    }
    await this.collectionModel.deleteMany({_id: {$in: invalidCollections.map(c => c._id)}}).exec();
    return {status: 'success'};
  }
}
