import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { Gallery } from './dto/gallery.dto';

const GALLERY_PATH = 'gallery';

@Controller(GALLERY_PATH)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {
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

  @Get()
  list(): Promise<{ galleries: Gallery[], count: number }> {
    return this.galleryService.list();
  }
}
