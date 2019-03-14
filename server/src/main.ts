import * as os from 'os';
import * as compression from 'compression';
// import * as csurf from 'csurf';
import * as helmet from 'helmet';
import {NestFactory, FastifyAdapter} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {AppModule} from './app.module';
import './common/database';

function getLocalhostAddress() {
  const interfaces = os.networkInterfaces();
  let res = '0.0.0.0';
  Object.keys(interfaces).forEach((name) => {
    const details = interfaces[name];
    // console.log(details);
    const target = details.find((detail) => detail.address.startsWith('192.168'));
    // console.log(target);
    if (target) {
      console.log(target);
      res = target.address;
    }
  });
  return res;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new FastifyAdapter(), {cors: true});
  app.useGlobalPipes(new ValidationPipe());
  app.use(compression());
  // app.use(csurf());
  app.use(helmet());
  const port = 3000;
  const host = getLocalhostAddress();
  console.info(`Listening ${host}:${port}`);
  await app.listen(port, host);
}

bootstrap();
