import { Inject, Injectable } from '@nestjs/common';
import { database } from '../common/database'
import { AuthService } from '../auth/auth.service'

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
    return {token: this.authService.sign($loki)};
  }
}
