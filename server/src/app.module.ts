import { CacheModule, CacheInterceptor, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { SessionModule } from 'session/session.module';
import { GalleryModule } from './gallery/gallery.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    CacheModule.register(),
    SessionModule,
    GalleryModule,
    FileModule,
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
