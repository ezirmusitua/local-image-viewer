import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {CollectionService} from './collection.service';
import {CollectionController} from './collection.controller';
import {AuthModule} from '../auth/auth.module';
import {CollectionSchema} from './collection.schema';
import {SessionSchema} from '../session/session.schema';
import {FileSchema} from './file.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {name: 'Collection', schema: CollectionSchema},
      {name: 'Session', schema: SessionSchema},
      {name: 'File', schema: FileSchema},
    ]),
  ],
  providers: [CollectionService],
  controllers: [CollectionController],
})
export class CollectionModule {
}
