import {IsDate, IsString} from 'class-validator';

export class File {
  @IsString()
  readonly name: string;
  @IsDate()
  readonly updateAt: Date;
}
