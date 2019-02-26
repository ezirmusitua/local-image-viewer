import * as compression from 'compression';
// import * as csurf from 'csurf';
import * as helmet from 'helmet';
import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import './common/database';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter(), {cors: true});
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  // app.use(csurf());
  app.use(helmet());
  await app.listen(3001, '0.0.0.0');
}

bootstrap();
