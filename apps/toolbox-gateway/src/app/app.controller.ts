import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
// import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }

  @Get('test-auth')
  testAuth() {
    return this.appService.testAuth();
  }
}
