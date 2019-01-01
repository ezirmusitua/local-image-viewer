import { Controller, Headers, Param, Post } from '@nestjs/common';
import { SessionService } from './session.service';

const SESSION_PATH = 'session';

@Controller(SESSION_PATH)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {
  }

  @Post()
  start(@Headers('Authorization') token: string): { token: string } {
    return this.sessionService.startNew(token);
  }
}
