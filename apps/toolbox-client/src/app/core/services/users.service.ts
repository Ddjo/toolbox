import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '@libs/common';
import { tap } from 'rxjs';
import { environment } from '../../../environments/environments';
import { UsersStore } from '../store/users/users.store';

export const url = environment.authApiUrl + '/users';
@Injectable({
  providedIn: 'root',
})
export class UsersService  {
  readonly usersStore = inject(UsersStore);

  constructor(private http: HttpClient ) {
  }

  createUser(user: {email: string, password: string}){
    // return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/create-user', user);
    return this.http.post<IUser>(url, user);
  }

  // login(user: {email: string, password: string}) {
  //   return this.http.post<Partial<{_id: string, email: string, password: string, error: string}>>(url + '/login', user);
  // }

  getUser() {
    return this.http.get<IUser>(`${url}/me`);
  }

  getAllUsers() {
    return this.http.get<IUser[]>(`${url}`).pipe(
      tap(users =>this.usersStore.setUsers(users)),
    );;
  }
}