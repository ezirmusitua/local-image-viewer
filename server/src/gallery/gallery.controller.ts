import {Controller, Get, Post} from '@nestjs/common';
import {GalleryService} from './gallery.service';
import {Gallery} from './dto/gallery.dto';

const GALLERY_PATH = 'gallery';

@Controller(GALLERY_PATH)
export class GalleryController {
  constructor(private readonly galleryService: GalleryService) {
  }

  @Post()
  createNew(): Promise<void> {
    return this.galleryService.insertNew();
  }

  @Get()
  list(): Promise<Gallery[]> {
    return this.galleryService.findAll();
  }
}
