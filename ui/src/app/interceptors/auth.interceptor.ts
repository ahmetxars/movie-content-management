import {
  inject
} from '@angular/core';

import {
  HttpInterceptorFn
} from '@angular/common/http';

import {
  AuthService
} from '../services/auth.service';

import {
  environment
} from '../../environments/environment';


export const authInterceptor: HttpInterceptorFn =
  (request, next) => {

    const authService =
      inject(AuthService);

    const token =
      authService.getToken();


    const isContentApiRequest =
      request.url.startsWith(
        environment.apiUrl
      );


    if (
      token &&
      isContentApiRequest
    ) {

      const authenticatedRequest =
        request.clone({

          setHeaders: {

            Authorization:
              `Bearer ${token}`

          }

        });


      return next(
        authenticatedRequest
      );

    }


    return next(request);

  };
