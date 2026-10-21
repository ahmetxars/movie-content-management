import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
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
  EMPTY,
  Subject,
  Subscription
} from 'rxjs';

import {
  catchError,
  debounceTime,
  finalize,
  switchMap
} from 'rxjs/operators';

import {
  Content
} from '../../models/content.model';

import {
  OmdbMovie
} from '../../models/omdb-movie.model';

import {
  ContentService
} from '../../services/content.service';

import {
  AuthService
} from '../../services/auth.service';

import {
  Router
} from '@angular/router';


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
export class MovieList implements OnInit, OnDestroy {

  contents: Content[] = [];

  searchTitle = '';

  searchResult?: OmdbMovie;

  loading = false;

  adding = false;

  errorMessage = '';

  successMessage = '';

  editingId?: number;

  editForm?: Content;


  // Saved movie filters
  libraryTitle = '';

  libraryGenre = '';

  libraryMinRating: number | null = null;

  sortBy = 'createdAt';

  sortDir = 'desc';

  pageSize = 4;

  currentPage = 0;

  totalPages = 0;

  totalElements = 0;


  deletingIds =
    new Set<number>();

  savingEditIds =
    new Set<number>();


  editValidationErrors = {
    title: '',
    year: '',
    rating: ''
  };

  get currentEmail(): string {

    return (
      this.authService.getEmail() ??
      ''
    );

  }


  get currentRole(): string {

    return (
      this.authService.getRole() ??
      ''
    );

  }


  private searchSubject =
    new Subject<string>();

  private searchSubscription?:
    Subscription;

  private searchSequence = 0;


  constructor(
    private contentService: ContentService,
    private authService: AuthService,
    private changeDetectorRef: ChangeDetectorRef,
  private router: Router
  ) {}


  ngOnInit(): void {

    this.loadContents();

    this.searchSubscription =
      this.searchSubject
        .pipe(

          debounceTime(250),

          switchMap((title) => {

            const searchId =
              ++this.searchSequence;

            this.loading = true;

            this.errorMessage = '';

            this.successMessage = '';

            this.searchResult =
              undefined;

            this.changeDetectorRef
              .markForCheck();


            return this.contentService
              .searchMovie(title)
              .pipe(

                catchError(
                  (error: HttpErrorResponse) => {

                    if (
                      searchId ===
                      this.searchSequence
                    ) {

                      this.errorMessage =
                        this.getSearchErrorMessage(
                          error
                        );

                      this.searchResult =
                        undefined;

                      this.changeDetectorRef
                        .markForCheck();
                    }

                    return EMPTY;
                  }
                ),

                finalize(() => {

                  if (
                    searchId ===
                    this.searchSequence
                  ) {

                    this.loading =
                      false;

                    this.changeDetectorRef
                      .markForCheck();
                  }

                })

              );

          })

        )
        .subscribe((movie) => {

          this.searchResult =
            movie;

          this.errorMessage = '';

          this.changeDetectorRef
            .markForCheck();

        });

  }


  ngOnDestroy(): void {

    this.searchSubscription
      ?.unsubscribe();

  }


  get isAdmin(): boolean {

    return this.authService
      .isAdmin();

  }


  get displayedPage(): number {

    if (
      this.totalPages === 0
    ) {

      return 0;

    }

    return this.currentPage + 1;

  }


  loadContents(): void {

    this.contentService
      .getContentsPage(

        this.libraryTitle.trim(),

        this.libraryGenre.trim(),

        this.libraryMinRating,

        this.currentPage,

        this.pageSize,

        this.sortBy,

        this.sortDir

      )
      .subscribe({

        next: (data) => {

          this.contents =
            data.content;

          this.currentPage =
            data.page;

          this.totalPages =
            data.totalPages;

          this.totalElements =
            data.totalElements;


          /*
           * Örneğin son sayfadaki tek filmi
           * sildiysek boş sayfada kalmayalım.
           */
          if (
            this.contents.length === 0 &&
            this.currentPage > 0 &&
            this.totalElements > 0
          ) {

            this.currentPage--;

            this.loadContents();

            return;

          }


          this.changeDetectorRef
            .markForCheck();

        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.errorMessage =
            this.getGeneralErrorMessage(
              error,
              'Saved movies could not be loaded.'
            );

          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  applyLibraryFilters(): void {

    this.currentPage = 0;

    this.errorMessage = '';

    this.successMessage = '';

    this.loadContents();

  }

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);

  }


  clearLibraryFilters(): void {

    this.libraryTitle = '';

    this.libraryGenre = '';

    this.libraryMinRating = null;

    this.sortBy = 'createdAt';

    this.sortDir = 'desc';

    this.pageSize = 4;

    this.currentPage = 0;

    this.loadContents();

  }


  previousPage(): void {

    if (
      this.currentPage <= 0
    ) {
      return;
    }


    this.currentPage--;

    this.loadContents();

  }


  nextPage(): void {

    if (
      this.currentPage >=
      this.totalPages - 1
    ) {
      return;
    }


    this.currentPage++;

    this.loadContents();

  }


  searchMovie(): void {

    const title =
      this.searchTitle.trim();


    if (!title) {

      this.errorMessage =
        'Please enter a movie title.';

      return;

    }


    this.searchSubject
      .next(title);

  }


  importMovie(): void {

    if (
      !this.searchResult ||
      this.adding ||
      !this.isAdmin
    ) {
      return;
    }


    const movieTitle =
      this.searchResult.Title;


    this.adding = true;

    this.errorMessage = '';

    this.successMessage = '';

    this.changeDetectorRef
      .markForCheck();


    this.contentService
      .importMovie(movieTitle)
      .pipe(

        finalize(() => {

          this.adding =
            false;

          this.changeDetectorRef
            .markForCheck();

        })

      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Movie added successfully.';

          this.errorMessage = '';


          if (
            this.searchResult?.Title ===
            movieTitle
          ) {

            this.searchResult =
              undefined;

            this.searchTitle =
              '';

          }


          this.currentPage = 0;

          this.loadContents();

          this.changeDetectorRef
            .markForCheck();

        },

        error: (
          error: HttpErrorResponse
        ) => {

          if (
            error.status === 409
          ) {

            this.errorMessage =
              error.error?.message ??
              'This movie is already in your library.';

          } else if (
            error.status === 403
          ) {

            this.errorMessage =
              'You do not have permission to add movies.';

          } else {

            this.errorMessage =
              this.getGeneralErrorMessage(
                error,
                'Movie could not be added.'
              );

          }


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  deleteMovie(
    id?: number
  ): void {

    if (
      id === undefined ||
      this.deletingIds.has(id) ||
      !this.isAdmin
    ) {
      return;
    }


    const confirmed =
      window.confirm(
        'Are you sure you want to delete this movie?'
      );


    if (!confirmed) {
      return;
    }


    this.deletingIds
      .add(id);

    this.errorMessage = '';

    this.successMessage = '';

    this.changeDetectorRef
      .markForCheck();


    this.contentService
      .deleteContent(id)
      .pipe(

        finalize(() => {

          this.deletingIds
            .delete(id);

          this.changeDetectorRef
            .markForCheck();

        })

      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Movie deleted successfully.';

          this.errorMessage = '';

          this.loadContents();

          this.changeDetectorRef
            .markForCheck();

        },

        error: (
          error: HttpErrorResponse
        ) => {

          this.errorMessage =
            this.getGeneralErrorMessage(
              error,
              'Movie could not be deleted.'
            );

          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  startEdit(
    movie: Content
  ): void {

    if (!this.isAdmin) {
      return;
    }


    this.editingId =
      movie.id;

    this.editForm = {
      ...movie
    };


    this.editValidationErrors = {
      title: '',
      year: '',
      rating: ''
    };


    this.errorMessage = '';

    this.successMessage = '';

  }


  cancelEdit(): void {

    this.editingId =
      undefined;

    this.editForm =
      undefined;

    this.editValidationErrors = {
      title: '',
      year: '',
      rating: ''
    };

  }


  private validateEditForm(): boolean {

    if (!this.editForm) {
      return false;
    }


    this.editValidationErrors = {
      title: '',
      year: '',
      rating: ''
    };


    const title =
      this.editForm.title
        ?.trim() ?? '';

    const year =
      this.editForm.year;

    const rating =
      this.editForm.rating;


    if (!title) {

      this.editValidationErrors.title =
        'Title is required.';

    }


    if (
      year !== null &&
      year !== undefined &&
      (
        year < 1888 ||
        year > 2100
      )
    ) {

      this.editValidationErrors.year =
        'Year must be between 1888 and 2100.';

    }


    if (
      rating !== null &&
      rating !== undefined &&
      (
        rating < 0 ||
        rating > 10
      )
    ) {

      this.editValidationErrors.rating =
        'Rating must be between 0 and 10.';

    }


    return (
      !this.editValidationErrors.title &&
      !this.editValidationErrors.year &&
      !this.editValidationErrors.rating
    );

  }


  saveEdit(): void {

    if (
      this.editingId === undefined ||
      !this.editForm ||
      !this.isAdmin
    ) {
      return;
    }


    if (
      !this.validateEditForm()
    ) {
      return;
    }


    const movieId =
      this.editingId;


    if (
      this.savingEditIds.has(
        movieId
      )
    ) {
      return;
    }


    const payload: Content = {

      ...this.editForm,

      title:
        this.editForm
          .title
          .trim()

    };


    this.savingEditIds
      .add(movieId);

    this.errorMessage = '';

    this.successMessage = '';

    this.changeDetectorRef
      .markForCheck();


    this.contentService
      .updateContent(
        movieId,
        payload
      )
      .pipe(

        finalize(() => {

          this.savingEditIds
            .delete(movieId);

          this.changeDetectorRef
            .markForCheck();

        })

      )
      .subscribe({

        next: (updatedMovie) => {

          this.contents =
            this.contents.map(
              movie =>
                movie.id === movieId
                  ? updatedMovie
                  : movie
            );


          if (
            this.editingId ===
            movieId
          ) {

            this.cancelEdit();

          }


          this.successMessage =
            'Movie updated successfully.';

          this.errorMessage = '';

          this.changeDetectorRef
            .markForCheck();

        },

        error: (
          error: HttpErrorResponse
        ) => {

          if (
            error.status === 409
          ) {

            this.errorMessage =
              error.error?.message ??
              'This movie was changed by another user. Reload and try again.';

          } else if (
            error.status === 400
          ) {

            this.errorMessage =
              'Please check the movie information.';

          } else if (
            error.status === 403
          ) {

            this.errorMessage =
              'You do not have permission to edit movies.';

          } else {

            this.errorMessage =
              this.getGeneralErrorMessage(
                error,
                'Movie could not be updated.'
              );

          }


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  isDeleting(
    id?: number
  ): boolean {

    return (
      id !== undefined &&
      this.deletingIds.has(id)
    );

  }


  isSavingEdit(
    id?: number
  ): boolean {

    return (
      id !== undefined &&
      this.savingEditIds.has(id)
    );

  }


  private getSearchErrorMessage(
    error: HttpErrorResponse
  ): string {

    if (
      error.status === 404
    ) {

      return 'Movie not found.';

    }


    if (
      error.status === 0
    ) {

      return 'Cannot connect to the server.';

    }


    if (
      error.status === 429
    ) {

      return 'Movie service rate limit reached. Please try again shortly.';

    }


    if (
      error.status >= 500
    ) {

      return 'Movie service is temporarily unavailable.';

    }


    return (
      error.error?.message ??
      'Movie search failed.'
    );

  }


  private getGeneralErrorMessage(
    error: HttpErrorResponse,
    fallbackMessage: string
  ): string {

    if (
      error.status === 0
    ) {

      return 'Cannot connect to the server.';

    }


    if (
      error.status === 401
    ) {

      return 'Please sign in again.';

    }


    if (
      error.status === 403
    ) {

      return 'You do not have permission to perform this action.';

    }


    if (
      error.status >= 500
    ) {

      return 'Server error. Please try again later.';

    }


    return (
      error.error?.message ??
      fallbackMessage
    );

  }

}
