import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { ServiceURL } from '../shared/serviceURL';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public authenticated: boolean;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  constructor(private http: HttpClient, private router: Router) {
    this.authenticated = this.isAuthenticated();
  }

  login(username: string, password: string): Observable<any> {
    return this.http
      .post(ServiceURL.loginURL, { username, password }, this.httpOptions)
      .pipe(
        tap((userResponse) => {
          if (userResponse.user) this.setAuthInfo(userResponse.user);
        })
      );
  }

  logout() {
    return this.http.get(ServiceURL.logoutURL).pipe(
      tap((response: any) => {
        if (response.ok) this.clearAuthInfo();
      })
    );
  }

  clearAuthInfo() {
    localStorage.clear();
    this.authenticated = false;
    this.router.navigate(['login']);
  }

  setAuthInfo(authUser: User) {
    localStorage.setItem('authUser', JSON.stringify(authUser));
    localStorage.setItem(
      'is_authenticated',
      JSON.stringify(authUser.is_authenticated)
    );
    this.authenticated = authUser.is_authenticated;
  }

  getAuthInfo(): User {
    return JSON.parse(localStorage.getItem('authUser'));
  }

  isAuthenticated(): boolean {
    return JSON.parse(localStorage.getItem('is_authenticated'));
  }
}
