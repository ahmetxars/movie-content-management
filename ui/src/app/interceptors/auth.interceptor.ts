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


    /*
     * Content API:
     * http://localhost:8080/api/contents
     */
    const isContentApiRequest =
      request.url.startsWith(
        environment.apiUrl
      );


    /*
     * Admin API:
     * authApiUrl:
     * http://localhost:8080/api/auth
     *
     * Buradan:
     * http://localhost:8080/api/admin
     * oluşturuyoruz.
     */
    const adminApiUrl =
      environment.authApiUrl.replace(
        '/api/auth',
        '/api/admin'
      );


    const isAdminApiRequest =
      request.url.startsWith(
        adminApiUrl
      );


    /*
     * Sadece bizim korumalı backend
     * endpointlerine JWT ekle.
     */
    const shouldAddToken =
      isContentApiRequest ||
      isAdminApiRequest;


    if (
      token &&
      shouldAddToken
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
