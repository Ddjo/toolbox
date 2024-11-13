// import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
// import { ClientProxy } from '@nestjs/microservices';
// import { AUTH_SERVICE } from "@constants";
// import { catchError, map, Observable, of, tap } from "rxjs";

// @Injectable() 
// export class JwtAuthGuard implements CanActivate {
//     constructor(@Inject(AUTH_SERVICE) private readonly authClient: ClientProxy) {}

//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         const jwt = 
//             context.switchToHttp().getRequest().cookies?.Authentication ||
//             context.switchToHttp().getRequest()?.Authentication ||
//             context.switchToHttp().getRequest().headers?.Authentication;

//         console.log('jwt', jwt)
        
//         if (!jwt) {
//             return false;
//         }

//         return this.authClient
//             .send('authenticate', {
//                 Authentication: jwt
//             })
//             .pipe(
//                 tap((res) => {
//                     context.switchToHttp().getRequest().user = res;
//                 }),
//                 map(() => true),
//                 catchError(() => of(false))
//             );
//     }
// }