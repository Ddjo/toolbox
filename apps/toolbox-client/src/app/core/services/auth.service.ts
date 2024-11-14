import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { environment } from '../../../../src/environments/environments';
import { Observable } from 'rxjs';

export const url = environment.gatewayApiUrl + '/auth';
@Injectable({
  providedIn: 'root',
})
export class AuthService  {

  constructor(private http: HttpClient, private globalService: GlobalService ) {
  }

  // createUser(user: {email: string, password: string}){
  //   // return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/create-user', user);
  //   return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/create-user', user);
  // }

  login(user: {email: string, password: string}) {
    return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/login', user);
  }

}