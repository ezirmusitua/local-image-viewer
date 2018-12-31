import { Controller, Get } from '@nestjs/common';
import { SessionService } from './session.service';
import { Session } from './dto/session.dto';

const SESSION_PATH = 'session';

@Controller(SESSION_PATH)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {
  }

  @Get()
  findAll(): Promise<{ sessions: Session[], count: number }> {
    return this.sessionService.findAll();
  }
}
