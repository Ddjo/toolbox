// import { Injectable } from "@angular/core";
// import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
// import { AuthService } from "../services/auth.service";
// import { catchError, map, Observable, of, tap } from "rxjs";
// import { UsersService } from "../services/users.service";

// @Injectable({ providedIn: 'root' })
// export class AuthResolve implements Resolve<boolean> {
//  // bring in Auth future State service
//  constructor(
//     private usersService: UsersService, 
//     private authService: AuthService, 
//     private router: Router
// ) { }
//  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

//     return this.usersService.getUser().pipe(
//         map((userMail) => {
//             this.authService.currentUserSig.set(userMail);
//             return  true;
//         }),
//         catchError((err) => {
//             console.log('err ', err)
//             console.log('nav to login resolver')
//             this.router.navigate(['/login'])
//             return of(false);
//         })
//         // tap((userMail) => this.authService.currentUserSig.set(userMail))
//       )
      
//     //   .subscribe({
//     //     complete: () => { this.router.navigate(['/home']) },
//     //   });    

//     // listen to state changes
//     // return this.authState.stateItem$.pipe(
//     //   // if item exists redirect to default
//     //   // later we will enhance this with a redirect url
//     //    map(user => {
//     //       if (user) {
//     //          this.router.navigateByUrl('/private/dashboard');
//     //       }
//     //       // does not really matter, I either go in or navigate away
//     //       return true;
//     //    })
//     // );
//  }
// }
