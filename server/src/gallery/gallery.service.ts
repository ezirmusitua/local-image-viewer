import {Injectable} from '@nestjs/common';
import {Gallery} from './dto/gallery.dto';
import {database} from '../common/database';

@Injectable()
export class GalleryService {
  async insertNew(): Promise<void> {
    const gallery = database.getCollection('gallery');
    gallery.insert({
      name: '123',
      path: '.',
      fileCount: 0,
      files: [],
      updatedAt: new Date()
    });
  }

  async findAll(): Promise<Gallery[]> {
    const gallery = database.getCollection('gallery');
    return gallery.find({name: '123'});
  }
}
