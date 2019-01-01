import { IsString, IsNumber, IsDate, IsArray } from 'class-validator';

export class SessionBrowseHistory {
  @IsString()
  name: string;
  @IsNumber()
  fileCount: number;
  @IsNumber()
  lasting: number;
  @IsNumber()
  score: number;
}

export class Session {
  @IsNumber()
  $loki;

  @IsDate()
  activeAt: Date;

  @IsArray()
  galleryBrowseHistory: SessionBrowseHistory[];
}
