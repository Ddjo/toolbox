import { AUTH_SERVICE } from '@constants';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, map, of, tap } from 'rxjs';

@Injectable()
export class WsJwtAuthGuard implements CanActivate {

    constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

    canActivate(context: ExecutionContext) {

        const cookies: string[] =  context.switchToWs().getClient().handshake.headers.cookie.split('; ');
        const jwt = cookies.find(cookie => cookie.startsWith('Authentication'))?.split('=')[1];

        if (!jwt) {
            return false;
        }

        return this.authClient
            .send('authenticate', {
                Authentication: jwt,
            })
            .pipe(
                tap((res) => {
                context.switchToHttp().getRequest<Request & {user: any}>().user = res;
                }),
                map(() => true),
                catchError((err) => {
                console.log('common lib - WsJwtAuthGuard - err : ', err);
                return of(false)}),
            );
    }
}