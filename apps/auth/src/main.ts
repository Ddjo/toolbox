// /**
//  * This is not a production server yet!
//  * This is only a minimal backend to get started.
//  */

// import { Logger, ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AuthModule } from './app/auth.module';


// async function bootstrap() {
//   const app = await NestFactory.create(AuthModule);

//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true
//     })
//   );

//   const globalPrefix = 'api';
//   app.setGlobalPrefix(globalPrefix);

//   app.useLogger(app.get(Logger));
  
//   await app.listen(3001);
//   Logger.log(
//     `🚀 Application is running on: http://localhost:3001/${globalPrefix}`
//   );
// }

// bootstrap();

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';
import { AuthModule } from './auth.module';

async function bootstrap() {
  // const app = await NestFactory.create(AuthModule);
  // const configService = app.get(ConfigService);

  // app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.TCP,
  //   options: {
  //     host: '0.0.0.0',
  //     port: configService.get('TCP_PORT')
  //   }
  
  // });

  // app.use(cookieParser());

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  // app.useLogger(app.get(Logger));

  // await app.startAllMicroservices();
  // await app.listen(configService.get('HTTP_PORT')).then(() => {
  //   console.log(`Auth Microservice is listening to port ${configService.get('HTTP_PORT')}`);
  // });

  const app = await NestFactory.create(AuthModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });
  await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
