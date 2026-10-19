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

  templateUrl: './login.html',

  styleUrl: './login.scss'
})
export class Login {

  email = '';

  password = '';

  loading = false;

  errorMessage = '';


  constructor(
    private authService: AuthService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}


  login(): void {

    const email =
      this.email.trim();


    if (
      !email ||
      !this.password
    ) {

      this.errorMessage =
        'Email and password are required.';

      return;
    }


    this.loading = true;

    this.errorMessage = '';


    this.authService
      .login(
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

          this.router
            .navigate(['/movies']);

        },

        error: (
          error: HttpErrorResponse
        ) => {

          if (
            error.status === 401
          ) {

            this.errorMessage =
              'Invalid email or password.';

          } else if (
            error.status === 0
          ) {

            this.errorMessage =
              'Cannot connect to the server.';

          } else {

            this.errorMessage =
              'Login failed. Please try again.';

          }


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }

}




