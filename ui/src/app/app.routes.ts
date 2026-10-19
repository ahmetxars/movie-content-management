import {
  Routes
} from '@angular/router';

import {
  MovieList
} from './pages/movie-list/movie-list';

import {
  Login
} from './pages/login/login';

import {
  authGuard
} from './guards/auth.guard';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'movies',
    component: MovieList,
    canActivate: [
      authGuard
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];
