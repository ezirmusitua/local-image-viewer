import {Controller, Headers, Param, ParseIntPipe, Post, Query} from '@nestjs/common';
import {SessionService} from './session.service';

const SESSION_PREFIX = 'session';

@Controller(SESSION_PREFIX)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {
  }

  @Post()
  start(@Headers('authorization') token: string) {
    return this.sessionService.startNew(token);
  }

  @Post('/view/collection/:collectionId')
  viewCollection(
    @Headers('authorization') token: string,
    @Param('collectionId') collectionId: string,
    @Query('lasting', ParseIntPipe) lasting: number,
  ): void {
    this.sessionService.viewCollection(token, collectionId, lasting);
  }
}
