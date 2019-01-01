import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { database } from '../common/database'
import { AuthService } from '../auth/auth.service'
import { Session } from './dto/session.dto'

@Injectable()
export class SessionService {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  startNew(token: string): { token: string } {
    const exists = this.authService.verify(token);
    if (exists) {
      return {token: token.slice(7)}
    }
    const sessionCollection = database.getCollection('session')
    const newSession = {
      activeAt: Date.now(),
      galleryBrowseHistory: [],
    };
    const {$loki} = sessionCollection.insert(newSession);
    console.log(newSession);
    return {token: this.authService.sign($loki)};
  }

  viewGallery(token: string, galleryId: number, lasting: number) {
    if (!this.authService.verify(token)) {
      throw new HttpException(
        'Invalid session',
        HttpStatus.BAD_REQUEST,
      )
    }
    const sessionCollection = database.getCollection('session')
    const id = this.authService.decode(token) as string;
    const session = sessionCollection.findOne({
      $loki: parseInt(id, 10),
    }) as Session;
    if (!session) {
      throw new HttpException(
        'Session not found',
        HttpStatus.NOT_FOUND,
      )
    }
    const galleryCollection = database.getCollection('gallery')
    const gallery = galleryCollection.findOne({$loki: galleryId});
    console.log(typeof galleryId, galleryCollection.find())
    if (!gallery) {
      throw new HttpException(
        'Gallery not found',
        HttpStatus.NOT_FOUND,
      )
    }
    const idx = session
      .galleryBrowseHistory
      .findIndex((h) => h.name === gallery.name);
    if (idx === -1) {
      session.galleryBrowseHistory.push({
        name: gallery.name,
        fileCount: gallery.fileCount,
        lasting,
        score: 1 / gallery.fileCount,
      });
    } else {
      const history = session.galleryBrowseHistory[idx];
      history.lasting += lasting;
      history.score += lasting / history.fileCount
      session.galleryBrowseHistory[idx] = history;
    }
    sessionCollection.update(session);
    console.log(session);
  }
}
