import {IsArray, IsDate, IsNumber, IsString} from 'class-validator';
import {File} from '../../file/dto/file.dto';

export class Gallery {
  @IsString()
  name: string;

  @IsString()
  path: string;

  @IsNumber()
  fileCount: number;

  @IsArray()
  files: File[];

  @IsDate()
  updatedAt: Date;
}
