import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import {Transport} from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('AUTH_TCP_PORT'),
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices().then(() => {
    console.log('auth microservices started on port ', configService.get('AUTH_TCP_PORT'));
  });
  await app.listen(configService.get('AUTH_HTTP_PORT')).then(() => {
    console.log('auth HTTP started on port ', configService.get('AUTH_HTTP_PORT'));
  });

}
bootstrap();

