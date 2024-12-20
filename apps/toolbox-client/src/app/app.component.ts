import {
  Component,
  OnInit
} from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LocalStorageVars } from '@constants';
import { catchError, of, tap } from 'rxjs';
import { AuthService } from './core/services/auth.service';
import { LocalStorageService } from './core/services/local-storage.service';
import { UsersService } from './core/services/users.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [
        RouterOutlet
    ]
})
export class AppComponent implements OnInit {

  constructor(
    private localStorageService: LocalStorageService,
    private usersService: UsersService, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const isUserToken = this.localStorageService.get(LocalStorageVars.accessToken) != null;

    if (isUserToken) {
      this.usersService.getUser().pipe(
        tap((userMail) => {
            this.authService.currentUserSig.set(userMail);
        }),
        catchError(() => {
          this.authService.removeSavedUserInfos();
          this.router.navigate(['login']);
          return of();
        })
      ).subscribe();
    }
 
  }

}
