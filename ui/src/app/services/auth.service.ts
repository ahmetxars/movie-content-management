import {
  Inject,
  Injectable,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  tap
} from 'rxjs';

import {
  environment
} from '../../environments/environment';

import {
  AuthResponse
} from '../models/auth-response.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey =
    'auth_token';

  private readonly emailKey =
    'auth_email';

  private readonly roleKey =
    'auth_role';

  private readonly isBrowser:
    boolean;


  constructor(
    private http: HttpClient,

    @Inject(PLATFORM_ID)
    platformId: object
  ) {

    this.isBrowser =
      isPlatformBrowser(
        platformId
      );
  }


  login(
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${environment.authApiUrl}/login`,
        {
          email,
          password
        }
      )
      .pipe(

        tap(response => {

          if (!this.isBrowser) {
            return;
          }

          localStorage.setItem(
            this.tokenKey,
            response.token
          );

          localStorage.setItem(
            this.emailKey,
            response.email
          );

          localStorage.setItem(
            this.roleKey,
            response.role
          );
        })
      );
  }


  register(
    email: string,
    password: string
  ): Observable<unknown> {

    return this.http.post(
      `${environment.authApiUrl}/register`,
      {
        email,
        password
      }
    );
  }


  logout(): void {

    if (!this.isBrowser) {
      return;
    }

    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      this.emailKey
    );

    localStorage.removeItem(
      this.roleKey
    );
  }


  getToken():
    string | null {

    if (!this.isBrowser) {
      return null;
    }

    return localStorage.getItem(
      this.tokenKey
    );
  }


  getEmail():
    string | null {

    if (!this.isBrowser) {
      return null;
    }

    return localStorage.getItem(
      this.emailKey
    );
  }


  getRole():
    string | null {

    if (!this.isBrowser) {
      return null;
    }

    return localStorage.getItem(
      this.roleKey
    );
  }


  isLoggedIn():
    boolean {

    return !!this.getToken();
  }


  isAdmin():
    boolean {

    return (
      this.getRole() ===
      'ADMIN'
    );
  }
}
