import {Injectable} from '@nestjs/common';
import {Session} from './dto/session.dto';

@Injectable()
export class SessionService {
  constructor() {
  }

  async findAll(): Promise<Session[]> {
    return [];
  }
}
