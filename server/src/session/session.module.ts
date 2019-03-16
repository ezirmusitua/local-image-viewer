import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {SessionService} from './session.service';
import {SessionController} from './session.controller';
import {SessionSchema} from './session.schema';
import {AuthModule} from '../auth/auth.module';
import {CollectionSchema} from '../collection/collection.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {name: 'Session', schema: SessionSchema},
      {name: 'Collection', schema: CollectionSchema},
    ]),
  ],
  providers: [SessionService],
  controllers: [SessionController],
})
export class SessionModule {
}
