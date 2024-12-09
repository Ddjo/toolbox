
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import  cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { ChatModule } from './app/chat.module';

async function bootstrap() {
  const app = await NestFactory.create(ChatModule);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('CHAT_TCP_PORT'),
    },
  },
  { inheritAppConfig: true },);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useLogger(app.get(Logger)); 

  await app.startAllMicroservices().then(() => {
    console.log('chat microservices started on port ', configService.get('CHAT_TCP_PORT'));
  });
}
bootstrap();
