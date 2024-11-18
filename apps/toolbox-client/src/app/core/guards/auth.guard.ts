// auth.guard.ts
import { isPlatformBrowser } from "@angular/common";
import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { CanActivate, Router, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
   providedIn: "root",
})
export class AuthGuard implements CanActivate {
   constructor(
      @Inject(PLATFORM_ID) private platformId: object,
      private authService: AuthService, 
      private router: Router,
  ) { }

   canActivate():
      | Observable<boolean | UrlTree>
      | Promise<boolean | UrlTree>
      | boolean
      | UrlTree {
  
      // check if the user is authorized to view the given page
      if(isPlatformBrowser(this.platformId)) {
         const accessInfo: string | null = this.authService.getAccessInfo();
         if (accessInfo === null) {
            this.router.navigate(['/login']);
           return false;
         }

         return true;
      } else {
         return false;
      }
    }


}