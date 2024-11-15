import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
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

  login(user: {email: string, password: string}) {
    return this.http.post<UserInterface>(url + '/login', user)
  }

  isUserAuthenticated(): boolean {
    return false;
  }

}