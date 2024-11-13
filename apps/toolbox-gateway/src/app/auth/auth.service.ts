import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@constants';
import { UserCredentialsDTO } from '../dto/user-credentials';

@Injectable()
export class AuthService {

    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

    createUser( userCredentialsDTO: UserCredentialsDTO) {
      return this.authClient.send('create-user', userCredentialsDTO);
    }

    login( userCredentialsDTO: UserCredentialsDTO) {
      return this.authClient.send('login', userCredentialsDTO);
    }
}
