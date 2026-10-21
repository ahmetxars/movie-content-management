import {
  inject,
  PLATFORM_ID
} from '@angular/core';

import {
  isPlatformBrowser
} from '@angular/common';

import {
  CanActivateFn,
  Router
} from '@angular/router';

import {
  AuthService
} from '../services/auth.service';


export const adminGuard:
  CanActivateFn = () => {

  const authService =
    inject(AuthService);

  const router =
    inject(Router);

  const platformId =
    inject(PLATFORM_ID);


  /*
   * Server-side rendering sırasında
   * localStorage erişilemez.
   *
   * Bu yüzden server aşamasında
   * route'u bloke etmiyoruz.
   */
  if (
    !isPlatformBrowser(platformId)
  ) {

    return true;
  }


  if (
    !authService.isLoggedIn()
  ) {

    return router.createUrlTree([
      '/login'
    ]);
  }


  if (
    !authService.isAdmin()
  ) {

    return router.createUrlTree([
      '/movies'
    ]);
  }


  return true;
};
