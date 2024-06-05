import { Injectable } from '@angular/core';
import {environment} from "@env/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";
import * as countriesLib from 'i18n-iso-countries';

declare const require: any;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURLUsers = environment.apiURL + '/users/';

  constructor(private httpService: HttpClient) {
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  getUsers(): Observable<User[]> {
    return this.httpService.get<User[]>(this.apiURLUsers);
  }

  getUser(userId: string): Observable<User> {
    return this.httpService.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  createUser(user: User): Observable<User> {
    return this.httpService.post<User>(this.apiURLUsers, user);
  }

  deleteUser(userId: string): Observable<User> {
    return this.httpService.delete<User>(`${this.apiURLUsers}` + userId);
  }

  editUser(user: User): Observable<User> {
    return this.httpService.put<User>(`${this.apiURLUsers}` + user.id, user);
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(countriesLib.getNames('en', {select: 'official'})).map((entry) => {
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }
  getCountry(countryKey: string): string {
    return <string>countriesLib.getName(countryKey, 'en');
  }
}
