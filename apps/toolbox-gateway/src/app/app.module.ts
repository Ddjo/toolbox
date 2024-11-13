// import { Module } from '@nestjs/common';

// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { AUTH_SERVICE, DatabaseModule } from '@libs/common';
// import { AuthController } from './auth/auth.controller';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import * as Joi from 'joi';

// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//       ClientsModule.registerAsync([
//         {
//           name: AUTH_SERVICE,
//           useFactory: (configService: ConfigService) => ({
//             transport: Transport.TCP,
//             options: {
//               host: configService.get('AUTH_HOST'),
//               port: configService.get('AUTH_PORT'),
//             },
//           }),
//           inject: [ConfigService],
//         },
//       ]),
//     ],
//   controllers: [AppController, AuthController],
//   providers: [AppService],
// })
// export class AppModule {}




import {  LoggerModule } from '@libs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AUTH_SERVICE } from '@constants';

@Module({
  imports: [
    // DatabaseModule,
    // DatabaseModule.forFeature([
    //   { name: BookDocument.name, schema: BookSchema },
    // ]),
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(), //we wil setup this env later
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configService: ConfigService) => {
          return ({
          transport: Transport.TCP,
          options: {
            // host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        })},
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController, AuthController],
  providers: [AppService, AuthService],
})
export class AppModule {}