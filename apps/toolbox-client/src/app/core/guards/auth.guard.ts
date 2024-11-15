// auth.guard.ts
import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanMatch, GuardResult, MaybeAsync, Route, UrlSegment } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { UsersService } from "../services/users.service";
import { catchError, map, of } from "rxjs";

@Injectable({
   providedIn: "root",
})
export class AuthGuard implements CanMatch {
   constructor(
      private usersService: UsersService, 
      private authService: AuthService, 
      private router: Router
  ) { }

   canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
         // Check if the user is authenticated
      // if (this.authService.currentUserSig() === undefined ) {
      //    // User is not authenticated, redirect to the login page or another route$
         
      //    console.log('nav to login guard')
      //    this.router.navigate(["/login"]);
      //    return false;
      // } else {
      //     // User is authenticated, allow access
      //    return true;
      // }

      // return this.usersService.getUser().pipe(
      //    map((userMail) => {
      //        this.authService.currentUserSig.set(userMail);
      //        return  true;
      //    }),
      //    catchError((err) => {
      //        console.log('err ', err)
      //        console.log('nav to login guard')
      //        this.router.navigate(['/login'])
      //        return of(false);
      //    })
      //    // tap((userMail) => this.authService.currentUserSig.set(userMail))
      //  )

      return true;
   }

   // canMatch(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
   //    // Check if the user is authenticated
   //    if (this.authService.currentUserSig() === undefined ) {
   //       // User is not authenticated, redirect to the login page or another route$
         
   //       console.log('nav to login guard')
   //       this.router.navigate(["/login"]);
   //       return false;
   //    } else {
   //        // User is authenticated, allow access
   //       return true;
   //    }
   // }
}