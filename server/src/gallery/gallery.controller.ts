import { Controller, Get, Post } from '@nestjs/common';
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

  @Get()
  list(): Promise<{ galleries: Gallery[], count: number }> {
    return this.galleryService.findAll();
  }
}
