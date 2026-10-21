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
  selector: 'app-register',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './register.html',

  styleUrl:
    './register.scss'
})
export class Register {

  email = '';

  password = '';

  confirmPassword = '';

  loading = false;

  errorMessage = '';

  successMessage = '';


  constructor(
    private authService:
    AuthService,

    private router:
    Router,

    private changeDetectorRef:
    ChangeDetectorRef
  ) {}


  register(): void {

    if (this.loading) {
      return;
    }


    const email =
      this.email.trim();


    if (!email) {

      this.errorMessage =
        'Email is required.';

      return;
    }


    if (!this.password) {

      this.errorMessage =
        'Password is required.';

      return;
    }


    if (
      this.password.length < 8
    ) {

      this.errorMessage =
        'Password must be at least 8 characters.';

      return;
    }


    if (
      this.password !==
      this.confirmPassword
    ) {

      this.errorMessage =
        'Passwords do not match.';

      return;
    }


    this.loading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.authService
      .register(
        email,
        this.password
      )
      .pipe(
        finalize(() => {

          this.loading = false;

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Account created successfully. You can now sign in.';

          this.email = '';

          this.password = '';

          this.confirmPassword = '';

          this.changeDetectorRef
            .markForCheck();
        },


        error: (
          error:
          HttpErrorResponse
        ) => {

          if (
            error.status === 409
          ) {

            this.errorMessage =
              error.error?.message ??
              'An account with this email already exists.';

          } else if (
            error.status === 400
          ) {

            this.errorMessage =
              error.error?.message ??
              'Please check the information you entered.';

          } else if (
            error.status === 0
          ) {

            this.errorMessage =
              'Backend server could not be reached.';

          } else {

            this.errorMessage =
              error.error?.message ??
              'Account could not be created.';
          }


          this.changeDetectorRef
            .markForCheck();
        }
      });
  }


  goToLogin(): void {

    this.router.navigate([
      '/login'
    ]);
  }
}
