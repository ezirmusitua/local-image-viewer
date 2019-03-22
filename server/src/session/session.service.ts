import {Model} from 'mongoose';
import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {AuthService} from '../auth/auth.service';
import {SessionDocument} from './session.interface';
import {CollectionCategory, CollectionDocument} from '../collection/collection.interface';

@Injectable()
export class SessionService {
  constructor(
    private readonly authService: AuthService,
    @InjectModel('Session') private readonly sessionModel: Model<SessionDocument>,
    @InjectModel('Collection') private readonly collectionModel: Model<CollectionDocument>,
  ) {
  }

  async startNew(token: string) {
    const exists = this.authService.verify(token);
    if (exists) return {token: token.slice(7)};
    const session = await this.sessionModel.create({});
    return {token: this.authService.sign(session._id.toString())};
  }

  async viewCollection(token: string, collectionId: string, lasting: number) {
    if (!this.authService.verify(token)) {
      throw new HttpException('Invalid session', HttpStatus.BAD_REQUEST);
    }
    const id = this.authService.decode(token) as string;
    const session = await this.sessionModel.findById(id).lean().exec();
    if (!session) {
      throw new HttpException('Session not found', HttpStatus.NOT_FOUND);
    }
    const collection = await this.collectionModel
      .findOne({_id: collectionId, valid: true})
      .lean()
      .exec();
    if (!collection) {
      throw new HttpException('Collection not found', HttpStatus.NOT_FOUND);
    }
    const idx = session.collectionBrowseHistory.findIndex((h) => h.name === collection.name);
    if (idx === -1) {
      const imageCount = collection.category === CollectionCategory.GALLERY ? collection.imageCount : 1;
      session.collectionBrowseHistory.push({
        name: collection.name,
        imageCount,
        lasting,
        score: lasting / imageCount,
      });
    } else {
      const history = session.collectionBrowseHistory[idx];
      history.lasting += lasting;
      history.score += lasting / history.imageCount;
      session.collectionBrowseHistory[idx] = history;
    }
    await this.sessionModel.updateOne({_id: session._id}, {$set: session}).exec();
  }
}
