import  cookieParser from 'cookie-parser';

import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useLogger(app.get(Logger));
  app.enableCors();
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'), () => {
    console.log('Server toolbox-gateway listening on port ', configService.get('PORT'))
  });
}

bootstrap();
