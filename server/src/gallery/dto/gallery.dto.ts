import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';
import { File } from '../../file/dto/file.dto';

export class Gallery {
  @IsNumber()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  path?: string;

  @IsString()
  thumbnail: string;

  @IsNumber()
  fileCount: number;

  @IsArray()
  files?: File[];

  @IsDate()
  updatedAt?: Date;
}
