import {Injectable} from '@nestjs/common';
import {File} from './dto/file.dto';

@Injectable()
export class FileService {
  constructor() {
  }

  async findAll(): Promise<File[]> {
    return [];
  }
}
