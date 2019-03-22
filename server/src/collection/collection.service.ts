import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as crypto from 'crypto';
import * as thumbsupply from 'thumbsupply';
import {HttpException, HttpStatus, Injectable, Request, Response} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {AuthService} from '../auth/auth.service';
import {CollectionCategory, CollectionDocument, createCollectionFromFile} from './collection.interface';
import {SessionDocument} from '../session/session.interface';
import {FileDocument, FileInterface} from './file.interface';
import {FILE} from 'dns';

const REPO = process.env.REPO;
const RANDOM_COUNT = 9;

function isImage(filename: string) {
  const IMAGE_PATTERN = /([a-zA-Z0-9\s_\\.\-():])+(.png|.jpg|.jpeg|.gif|.svg|.webp)$/;
  return IMAGE_PATTERN.test(filename);
}

function isVideo(filename: string) {
  const VIDEO_PATTERN = /([a-zA-Z0-9\s_\\.\-():])+(.mp4|.mkv|.avi|.rmvb|.mpg|.swf|.slv)$/;
  return VIDEO_PATTERN.test(filename);
}

function getMimeType(filename: string) {
  const extname = path.extname(filename).slice(1);
  if (isVideo(filename)) return `video/${extname}`;
  if (isImage(filename)) return `image/${extname}`;
  return 'unknown';
}

function sha1(str: string) {
  const hash = crypto.createHash('sha1');
  hash.update(str);
  return hash.digest('hex').slice(0, 8);
}

function promisify(func, ...params) {
  return new Promise((resolve, reject) => func(...params, (e) => e ? reject(e) : resolve(true)));
}

function rmCollection(cp) {
  const isDir = fs.statSync(cp).isDirectory();
  return promisify(isDir ? rimraf : fs.unlink, cp);
}

async function walkRepo(repoPath): Promise<FileInterface[]> {
  return new Promise((resolve) => {
    const dirs = [repoPath];
    const files: FileInterface[] = [];
    let i = 0;
    while (i < dirs.length) {
      const currentRoot = dirs[i];
      const parentHash = sha1(currentRoot.replace(repoPath, '') || 'REPO_ROOT');
      fs
        .readdirSync(currentRoot)
        .sort()
        .forEach((fn) => {
          const fp = path.join(currentRoot, fn);
          const stat = fs.statSync(fp);
          const isDir = stat.isDirectory();
          const ctime = stat.ctimeMs;
          const hash = sha1(fp.replace(repoPath, ''));
          const mimeType = getMimeType(fn);
          const file: FileInterface = {
            name: fn,
            path: fp,
            repoPath,
            parentHash,
            hash,
            isDir,
            ctime,
            mimeType,
          };
          files.push(file);
          if (isDir) {
            dirs.push(fp);
          }
        });
      i += 1;
    }
    return resolve(files);
  });
}

@Injectable()
export class CollectionService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel('Collection') private readonly collectionModel: Model<CollectionDocument>,
    @InjectModel('File') private readonly fileModel: Model<FileDocument>,
    @InjectModel('Session') private readonly sessionModel: Model<SessionDocument>,
  ) {
  }

  async pickUpNewFiles(candidates) {
    const existsHashes = await this.collectionModel.distinct('hash').lean().exec();
    const existsHashSet = new Set(existsHashes);
    return candidates.filter(c => !existsHashSet.has(c.hash) && !existsHashSet.has(c.parentHash));
  }

  async loadNewCollectionsFromRepo() {
    /**
     * NOTE: about handle REPO root changed files:
     * i think if files root or files changed, it should handle in other part of the application,
     * not in the moment of loading collections form REPO,
     * so, change the name of this function is a good idea
     */
    console.time('Prepare Candidates');
    console.info('Start loading from REPO: ', REPO);
    const candidates = await walkRepo(REPO);
    console.info('Candidate count: ', candidates.length);
    const newFiles = await this.pickUpNewFiles(candidates);
    const newCollections = newFiles.filter(f => f.isDir || f.mimeType.startsWith('video'));
    console.info('New collection count', newCollections.length);
    console.timeEnd('Prepare Candidates');
    const collections = [];
    console.time('Construct Collections');
    newCollections.forEach((f: FileInterface) => {
      if (f.mimeType.startsWith('video')) {
        collections.push(createCollectionFromFile(CollectionCategory.VIDEO, f));
      } else {
        const images = candidates.filter(c => c.mimeType.startsWith('image') && c.parentHash === f.hash);
        if (images && images.length) {
          collections.push(createCollectionFromFile(CollectionCategory.GALLERY, f, images));
        }
      }
    }, []);
    console.time('Construct Collections');
    console.info('Collection is ready: ', collections.length);
    console.time('Insert Collections');
    const COLLECTION_ROUND_CAPACITY = 25;
    const collectionTotalRound = Math.ceil((collections.length) / COLLECTION_ROUND_CAPACITY);
    for (const round of Array.from({length: collectionTotalRound}).map((v, k) => k)) {
      const promises = collections
        .slice(round * COLLECTION_ROUND_CAPACITY, (round + 1) * COLLECTION_ROUND_CAPACITY)
        .map(c => this.collectionModel.create(c));
      await Promise.all(promises);
    }
    console.timeEnd('Insert Collections');
    console.time('Insert Files');
    const FILE_ROUND_CAPACITY = 50;
    const fileTotalRound = Math.ceil(newFiles.length / FILE_ROUND_CAPACITY);
    for (const round of Array.from({length: fileTotalRound}).map((v, k) => k)) {
      const promises = newFiles
        .slice(round * FILE_ROUND_CAPACITY, (round + 1) * FILE_ROUND_CAPACITY)
        .map(f => this.fileModel.create(f));
      await Promise.all(promises);
    }
    console.timeEnd('Insert Files');
    console.info('Repo Loaded');
  }

  async random() {
    const totalCount = await this.collectionModel.count({valid: true}).exec();
    const set = new Set();
    while (set.size < RANDOM_COUNT) {
      set.add(Math.floor(Math.random() * totalCount));
    }
    const promises = [];
    for (const pos of set.values()) {
      promises.push(
        this.collectionModel
          .findOne({valid: true}, {_id: 1, name: 1, thumbnail: 1, imageCount: 1})
          .skip(pos)
          .lean()
          .exec(),
      );
    }
    const collections = await Promise.all(promises);
    return {
      items: collections,
      count: collections.length,
    };
  }

  async list(query, pageIndex, pageSize) {
    const totalCount = await this.collectionModel.count({...(query || {}), valid: true}).exec();
    const collections = await this.collectionModel
      .find({...(query || {}), valid: true}, {_id: 1, name: 1, thumbnail: 1, imageCount: 1})
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
      }, {_id: 1, name: 1, thumbnail: 1, imageCount: 1})
      .limit(5)
      .lean()
      .exec();
    return {items: collections, count: collections.length} as any;
  }

  async thumbnail(id: string) {
    const collection = await this
      .collectionModel
      .findOne({_id: id, valid: true}, {hash: 1, category: 1, thumbnail: 1})
      .lean()
      .exec();
    if (!collection) throw Error(`Collection not found`);
    if (collection.category === CollectionCategory.GALLERY) return this.image(collection.thumbnail);
    // handle thumbnail of video
    const video = await this.fileModel.findOne({hash: collection.hash}).lean().exec();
    const videoThumbnail = await thumbsupply.generateThumbnail(video.path, {
      size: thumbsupply.ThumbSize.LARGE,
      timestamp: '15%',
      cacheDir: '../.cache',
      mimetype: video.mimeType,
    });
    return {type: 'video/mp4', content: fs.readFileSync(videoThumbnail)};
  }

  async detail(id: string) {
    const collection = await this
      .collectionModel
      .findOne({_id: id, valid: true}).lean().exec();
    if (!collection) throw new Error('Collection not found');
    return {collection};
  }

  async image(hash: string) {
    const image = await this.fileModel.findOne({hash}).lean().exec();
    if (!image) throw Error(`Image not found`);
    const content = fs.readFileSync(image.path);
    const type = image.mimeType;
    return {content, type};
  }

  async video(hash: string, req, res) {
    const video = await this.fileModel.findOne({hash}).lean().exec();
    const stat = fs.statSync(video.path);
    const videoSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;
      const chunkSize = (end - start) + 1;
      const fileChunk = fs.createReadStream(video.path, {start, end});
      res
        .header('content-range', `bytes ${start}-${end}/${videoSize}`)
        .header('accept-range', 'bytes')
        .header('content-length', chunkSize)
        .header('content-type', video.mimeType)
        .code(206)
        .send(fileChunk);
    } else {
      res.send(fs.createReadStream(video.path));
    }
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
      const promises = invalidCollections.slice(r, (r + 1) * 20).map((g) => rmCollection(g.path));
      await Promise.all(promises);
    }
    await this.collectionModel.deleteMany({_id: {$in: invalidCollections.map(c => c._id)}}).exec();
    return {status: 'success'};
  }
}
