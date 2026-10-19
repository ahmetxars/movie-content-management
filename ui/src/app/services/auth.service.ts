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

  private readonly authApiUrl =
    environment.authApiUrl;

  private readonly tokenKey =
    'auth_token';

  private readonly emailKey =
    'auth_email';

  private readonly roleKey =
    'auth_role';


  constructor(
    private http: HttpClient,

    @Inject(PLATFORM_ID)
    private platformId: object
  ) {}


  register(
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${this.authApiUrl}/register`,
        {
          email,
          password
        }
      )
      .pipe(
        tap(response =>
          this.saveAuthentication(
            response
          )
        )
      );

  }


  login(
    email: string,
    password: string
  ): Observable<AuthResponse> {

    return this.http
      .post<AuthResponse>(
        `${this.authApiUrl}/login`,
        {
          email,
          password
        }
      )
      .pipe(
        tap(response =>
          this.saveAuthentication(
            response
          )
        )
      );

  }


  logout(): void {

    if (!this.isBrowser()) {
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


  getToken(): string | null {

    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(
      this.tokenKey
    );

  }


  getEmail(): string | null {

    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(
      this.emailKey
    );

  }


  getRole(): 'USER' | 'ADMIN' | null {

    if (!this.isBrowser()) {
      return null;
    }

    const role =
      localStorage.getItem(
        this.roleKey
      );

    if (
      role === 'USER' ||
      role === 'ADMIN'
    ) {

      return role;

    }

    return null;

  }


  isLoggedIn(): boolean {

    return !!this.getToken();

  }


  isAdmin(): boolean {

    return (
      this.getRole() === 'ADMIN'
    );

  }


  private saveAuthentication(
    response: AuthResponse
  ): void {

    if (!this.isBrowser()) {
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

  }


  private isBrowser(): boolean {

    return isPlatformBrowser(
      this.platformId
    );

  }

}
