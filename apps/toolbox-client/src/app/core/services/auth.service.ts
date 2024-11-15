import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { filter, tap } from 'rxjs';
import { environment } from '../../../../src/environments/environments';
import { UserInterface } from '../models/types/user';
import { GlobalService } from './global.service';

export const url = environment.gatewayApiUrl + '/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService  {

  currentUserSig = signal<UserInterface |undefined | null>(undefined);

  constructor(private http: HttpClient, private globalService: GlobalService ) {
  }

  // createUser(user: {email: string, password: string}){
  //   // return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/create-user', user);
  //   return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/create-user', user);
  // }

  login(user: {email: string, password: string}) {
    return this.http.post<UserInterface>(url + '/login', user)
    .pipe(
      filter(user => !!user.token),
      tap(user => this.setToken(user.token)));
  }

  isUserAuthenticated(): boolean {
    return false;
  }

  setToken(token : string) {
      localStorage.setItem('access_token', token);
  }
}