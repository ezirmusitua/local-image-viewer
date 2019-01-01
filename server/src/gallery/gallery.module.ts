import { Module } from '@nestjs/common';
import { GalleryService } from './gallery.service';
import { GalleryController } from './gallery.controller';
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  providers: [GalleryService],
  controllers: [GalleryController],
})
export class GalleryModule {
}
