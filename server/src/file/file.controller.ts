import {Controller, Get} from '@nestjs/common';
import {FileService} from './file.service';
import {File} from './dto/file.dto';

const FILE_PATH = 'file';

@Controller(FILE_PATH)
export class FileController {
  constructor(private readonly fileService: FileService) {
  }

  @Get()
  findAll(): Promise<File[]> {
    return this.fileService.findAll();
  }
}
