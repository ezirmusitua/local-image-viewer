import {
  Controller, Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Response,
} from '@nestjs/common';
import {CollectionService} from './collection.service';

const COLLECTION_PREFIX = 'collection';

@Controller(COLLECTION_PREFIX)
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
  ) {
  }

  @Post('/upsert-repo')
  upsertRepo(): Promise<void> {
    return this.collectionService.loadFromRepo();
  }

  @Get('/random')
  random() {
    return this.collectionService.random();
  }

  @Get('/thumbnail')
  async thumbnail(@Query('id') id: string, @Response() res) {
    try {
      const {content, type} = await this.collectionService.thumbnail(id);
      return res.type(type).send(content);
    } catch (e) {
      console.error(e);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:id/image/:name')
  async image(
    @Param('id') id: string,
    @Param('name') name: string,
    @Response() res,
  ) {
    try {
      const {content, type} = await this.collectionService.image(id, name);
      return res.type(type).send(content);
    } catch (e) {
      console.error(e);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Get('/recommend')
  recommend(
    @Headers('authorization') token: string,
  ) {
    return this.collectionService.recommend(token);
  }

  @Get('/:id')
  detail(@Param('id') id: string) {
    try {
      return this.collectionService.detail(id);
    } catch (e) {
      console.error(e);
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
  }

  @Get()
  list(
    @Query('name') name: string,
    @Query('pageIndex', ParseIntPipe) pageIndex: number = 1,
    @Query('pageSize', ParseIntPipe) pageSize: number = 9,
  ) {
    let query = {} as any;
    if (name) {
      query.name = {$regex: name};
    } else {
      query = null;
    }
    return this.collectionService.list(query, pageIndex, pageSize);
  }

  @Delete('/invalid')
  clearInvalid() {
    return this.collectionService.clearInvalid();
  }

  @Delete('/:id')
  removeCollection(@Param('id') id: string) {
    return this.collectionService.removeCollection(id);
  }
}
