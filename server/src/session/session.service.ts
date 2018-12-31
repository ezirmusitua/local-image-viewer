import { Injectable } from '@nestjs/common';
import { Session } from './dto/session.dto';

@Injectable()
export class SessionService {
  constructor() {
  }

  async findAll(): Promise<{ sessions: Session[], count: number }> {
    return {sessions: [], count: 0};
  }
}
