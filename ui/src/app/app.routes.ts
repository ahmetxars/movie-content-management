import { Routes } from '@angular/router';

import {
  MovieList
} from './pages/movie-list/movie-list';

export const routes: Routes = [

  {
    path: '',
    component: MovieList
  },

  {
    path: '**',
    redirectTo: ''
  }

];
