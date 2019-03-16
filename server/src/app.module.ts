import {CacheModule, CacheInterceptor, Module} from '@nestjs/common';
import {APP_INTERCEPTOR} from '@nestjs/core';
import {MongooseModule} from '@nestjs/mongoose';
import {AppController} from './app.controller';
import {SessionModule} from 'session/session.module';
import {CollectionModule} from './collection/collection.module';
import {AuthModule} from './auth/auth.module';

@Module({
  imports: [
    CacheModule.register(),
    MongooseModule.forRoot('mongodb://localhost:27017/LocalMediaManager'),
    SessionModule,
    CollectionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [],
})
export class AppModule {
}
