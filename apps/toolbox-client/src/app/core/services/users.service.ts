import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { GlobalService } from './global.service';
import { UserInterface } from '../models/types/user';

export const url = environment.authApiUrl + '/users';
@Injectable({
  providedIn: 'root',
})
export class UsersService  {

  constructor(private http: HttpClient, private globalService: GlobalService ) {
  }

  createUser(user: {email: string, password: string}){
    // return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/create-user', user);
    return this.http.post<UserInterface>(url, user);
  }

  // login(user: {email: string, password: string}) {
  //   return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/login', user);
  // }

  getUser() {
    return this.http.get<UserInterface>(url);
  }
}