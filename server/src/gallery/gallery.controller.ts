import {
  Controller, Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import {GalleryService} from './gallery.service';
import {Gallery} from './dto/gallery.dto';

const GALLERY_PATH = 'gallery';

@Controller(GALLERY_PATH)
export class GalleryController {
  constructor(
    private readonly galleryService: GalleryService,
  ) {
  }

  @Post('/upsert-repo')
  upsertRepo(): Promise<void> {
    return this.galleryService.upsertRepo();
  }

  @Get('/random')
  random(): Promise<{ galleries: Gallery[], count: number }> {
    return this.galleryService.random();
  }

  @Get('/thumbnail')
  thumbnail(@Query('id', ParseIntPipe) id: number, @Response() res) {
    try {
      const {content, type} = this.galleryService.thumbnail(id);
      return res.type(type).send(content);
    } catch (e) {
      console.error(e);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id/image/:name')
  image(
    @Param('id', ParseIntPipe) id: number,
    @Param('name') name: string,
    @Response() res,
  ) {
    try {
      const {content, type} = this.galleryService.image(id, name);
      return res.type(type).send(content);
    } catch (e) {
      console.error(e);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/recommend')
  recommend(
    @Headers('authorization') token: string,
  ) {
    return this.galleryService.recommend(token);
  }

  @Get('/:id')
  detail(@Param('id', ParseIntPipe) id: number) {
    try {
      const gallery = this.galleryService.detail(id);
      return {gallery};
    } catch (e) {
      console.error(e);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  list(
    @Query('name') name: string,
    @Query('pageIndex', ParseIntPipe) pageIndex: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 9,
  ): { galleries: Gallery[], count: number } {
    let query = {} as any;
    if (name) {
      query.name = {$regex: name};
    } else {
      query = null;
    }
    return this.galleryService.list(query, pageIndex, pageSize);
  }

  @Delete('/invalid')
  clearInvalid() {
    console.debug('Call clear invalid');
    return this.galleryService.clearInvalid();
  }

  @Delete('/:id')
  removeGallery(@Param('id', ParseIntPipe) id: number) {
    return this.galleryService.removeGallery(id);
  }
}
