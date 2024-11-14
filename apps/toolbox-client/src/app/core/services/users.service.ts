import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { environment } from '../../../environments/environments';
import { map, Observable } from 'rxjs';
import { ServerResponse } from 'http';

export const url = environment.gatewayApiUrl + '/users';
@Injectable({
  providedIn: 'root',
})
export class UsersService  {

  constructor(private http: HttpClient, private globalService: GlobalService ) {
  }

  createUser(user: {email: string, password: string}){
    // return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/create-user', user);
    return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url, user);
  }

  // login(user: {email: string, password: string}) {
  //   return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/login', user);
  // }

  getUser() {
    return this.http.get<Partial<{_id: string, email: string, password: string, error: string}>>(url)  
    .pipe(
      map(response => {
        console.log('response from backend service', response);
        const result= <ServerResponse>response; 
        console.log('result is ' + result)
        return result;
      })
    )
  }
}