
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { BooksModule } from './app/book.module';
import  cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(BooksModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('BOOKS_TCP_PORT'),
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
    console.log('book microservices launch on port ', configService.get('BOOKS_TCP_PORT'));
  });
  await app.listen(configService.get('BOOKS_HTTP_PORT')).then(() => {
    console.log('book HTTP launch on port ', configService.get('BOOKS_HTTP_PORT'));
  });
}
bootstrap();
