import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Content
} from '../../models/content.model';

import {
  OmdbMovie
} from '../../models/omdb-movie.model';

import {
  ContentService
} from '../../services/content.service';


@Component({

  selector: 'app-movie-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './movie-list.html',

  styleUrl: './movie-list.scss'
})
export class MovieList implements OnInit {

  contents: Content[] = [];

  searchTitle = '';

  searchResult?: OmdbMovie;

  loading = false;

  errorMessage = '';

  successMessage = '';

  editingId?: number;

  editForm?: Content;


  constructor(
    private contentService: ContentService
  ) {}


  ngOnInit(): void {

    this.loadContents();

  }


  loadContents(): void {

    this.contentService
      .getAllContents()
      .subscribe({

        next: (data) => {

          this.contents = data;

        },

        error: () => {

          this.errorMessage =
            'Saved movies could not be loaded.';

        }

      });

  }


  searchMovie(): void {

    const title =
      this.searchTitle.trim();

    if (!title) {
      return;
    }

    this.loading = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.searchResult = undefined;


    this.contentService
      .searchMovie(title)
      .subscribe({

        next: (movie) => {

          this.searchResult = movie;

          this.loading = false;

        },

        error: () => {

          this.errorMessage =
            'Movie not found.';

          this.loading = false;

        }

      });

  }


  importMovie(): void {

    if (!this.searchResult) {
      return;
    }


    this.contentService
      .importMovie(
        this.searchResult.Title
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Movie added successfully.';

          this.searchResult =
            undefined;

          this.searchTitle = '';

          this.loadContents();

        },

        error: () => {

          this.errorMessage =
            'Movie could not be added.';

        }

      });

  }


  deleteMovie(
    id?: number
  ): void {

    if (!id) {
      return;
    }


    const confirmed =
      window.confirm(
        'Are you sure you want to delete this movie?'
      );

    if (!confirmed) {
      return;
    }


    this.contentService
      .deleteContent(id)
      .subscribe({

        next: () => {

          this.successMessage =
            'Movie deleted successfully.';

          this.loadContents();

        },

        error: () => {

          this.errorMessage =
            'Movie could not be deleted.';

        }

      });

  }


  startEdit(
    movie: Content
  ): void {

    this.editingId =
      movie.id;

    this.editForm = {
      ...movie
    };

    this.errorMessage = '';

    this.successMessage = '';

  }


  cancelEdit(): void {

    this.editingId =
      undefined;

    this.editForm =
      undefined;

  }


  saveEdit(): void {

    if (
      !this.editingId ||
      !this.editForm
    ) {
      return;
    }


    this.contentService
      .updateContent(
        this.editingId,
        this.editForm
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Movie updated successfully.';

          this.cancelEdit();

          this.loadContents();

        },

        error: () => {

          this.errorMessage =
            'Movie could not be updated.';

        }

      });

  }

}
