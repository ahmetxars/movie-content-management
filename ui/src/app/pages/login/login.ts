import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  Router
} from '@angular/router';

import {
  finalize
} from 'rxjs/operators';

import {
  AuthService
} from '../../services/auth.service';


@Component({
  selector: 'app-login',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './login.html',

  styleUrl:
    './login.scss'
})
export class Login {

  email = '';

  password = '';

  loading = false;

  errorMessage = '';


  constructor(
    private authService:
    AuthService,

    private router:
    Router,

    private changeDetectorRef:
    ChangeDetectorRef
  ) {}

  goToRegister(): void {

    this.router.navigate([
      '/register'
    ]);
  }


  login(): void {



    if (
      this.loading
    ) {
      return;
    }


    const email =
      this.email.trim();


    if (
      !email
    ) {

      this.errorMessage =
        'Email is required.';

      return;

    }


    if (
      !this.password
    ) {

      this.errorMessage =
        'Password is required.';

      return;

    }


    this.loading =
      true;

    this.errorMessage =
      '';


    this.changeDetectorRef
      .markForCheck();


    this.authService
      .login(
        email,
        this.password
      )
      .pipe(

        finalize(
          () => {

            this.loading =
              false;

            this.changeDetectorRef
              .markForCheck();

          }
        )

      )
      .subscribe({

        next: () => {

          this.router
            .navigateByUrl(
              '/movies'
            );

        },


        error: (
          error:
          HttpErrorResponse
        ) => {

          if (
            error.status ===
            401
          ) {

            this.errorMessage =
              'Invalid email or password.';

          } else if (
            error.status ===
            0
          ) {

            this.errorMessage =
              'Backend server could not be reached.';

          } else {

            this.errorMessage =
              error.error?.message ??
              'Sign in failed.';

          }


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }

}
