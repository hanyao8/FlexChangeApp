import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from "../../environment/environment";
import { catchError, map } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable()
export class AuthProvider {

  constructor(public http: HttpClient) {
  }

  public login(username: string, password: string): Observable<boolean> {
    const data = {
      username: username,
      password: password,
    };
    const url = environment.serverUrl + '/login';
    return this.http.post(url, JSON.stringify(data)).pipe(
      map((response: any) => {
        console.log(response);
        if (response && 'token' in response) {
          localStorage.setItem('token', response.token);
          return true;
        }

        return false;
      }),
    );
  }

  public logout() {
    localStorage.clear();
  }

  public isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}
