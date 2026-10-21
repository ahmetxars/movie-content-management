import {
  Routes
} from '@angular/router';

import {
  Login
} from './pages/login/login';

import {
  Register
} from './pages/register/register';

import {
  MovieList
} from './pages/movie-list/movie-list';

import {
  CategoryManagement
} from './pages/category-management/category-management';

import {
  ActorManagement
} from './pages/actor-management/actor-management';

import {
  UserManagement
} from './pages/user-management/user-management';

import {
  authGuard
} from './guards/auth.guard';

import {
  adminGuard
} from './guards/admin.guard';


export const routes:
  Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'movies',
    component: MovieList,
    canActivate: [
      authGuard
    ]
  },

  {
    path: 'categories',
    component:
    CategoryManagement,

    canActivate: [
      authGuard,
      adminGuard
    ]
  },

  {
    path: 'actors',
    component:
    ActorManagement,

    canActivate: [
      authGuard,
      adminGuard
    ]
  },

  {
    path: 'users',
    component:
    UserManagement,

    canActivate: [
      authGuard,
      adminGuard
    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
