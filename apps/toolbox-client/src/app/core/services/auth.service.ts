import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { LocalStorageVars } from '@constants';
import { tap } from 'rxjs';
import { environment } from '../../../../src/environments/environments';
import { UserInterface } from '../models/types/user';
import { LocalStorageService } from './local-storage.service';

export const url = environment.authApiUrl + '/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService  {

  currentUserSig = signal<UserInterface |undefined>(undefined);

  constructor(
    private http: HttpClient, 
    private localStorageService: LocalStorageService
  ) {}

  login(user: {email: string, password: string}) {
    return this.http.post<{email: string, token: string}>(url + '/login', user).pipe(
      tap(() => this.currentUserSig.set({email: user.email})),
      // tap(console.log),
      tap((res) => this.localStorageService.setItem(LocalStorageVars.accessToken,res.token))
    );
  }

  logout() {
    return this.http.post(url + '/logout', {}).pipe(
      tap(() => this.removeSavedUserInfos()),
    );
  }

  removeSavedUserInfos() {
    this.currentUserSig.set(undefined);
    this.localStorageService.removeItem(LocalStorageVars.accessToken);
  }

    /**
   * Get user information for authentication. The data comes from local storage.
   * @returns user information needed for authentication and authorization. Returns null if no information is found.
   */
    public getAccessInfo(): string | null {
      const user = this.localStorageService.getItem<string>(LocalStorageVars.accessToken);
      if (user) {
        return user.getValue();
      }
      return null;
    }


}