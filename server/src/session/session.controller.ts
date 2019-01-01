import { Controller, Headers, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { SessionService } from './session.service';

const SESSION_PATH = 'session';

@Controller(SESSION_PATH)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {
  }

  @Post()
  start(@Headers('authorization') token: string): { token: string } {
    return this.sessionService.startNew(token);
  }

  @Post('/view/gallery/:galleryId')
  viewGallery(
    @Headers('authorization') token: string,
    @Param('galleryId', ParseIntPipe) galleryId: number,
    @Query('lasting', ParseIntPipe) lasting: number,
  ): void {
    this.sessionService.viewGallery(token, galleryId, lasting);
  }
}
