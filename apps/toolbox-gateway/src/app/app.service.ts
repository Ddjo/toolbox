import { AUTH_SERVICE } from '@constants';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
constructor( @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,     
) {}

  getData(): { message: string } {
    return { message: 'Hello API' };
  }

  testAuth() {
    return this.authClient.send('test-auth', {});
  }
}
