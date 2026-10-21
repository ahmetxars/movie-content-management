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

  templateUrl:
    './movie-list.html',

  styleUrl:
    './movie-list.scss'
})
export class MovieList
  implements OnInit, OnDestroy {

  contents: Content[] = [];


  /*
   * OMDb search
   */

  searchTitle = '';

  searchResult?:
    OmdbMovie;

  loading = false;

  adding = false;


  /*
   * Global messages
   */

  errorMessage = '';

  successMessage = '';


  /*
   * Manual content form
   */

  showManualForm =
    false;

  manualSaving =
    false;

  manualForm:
    Content =
    this.createEmptyManualForm();

  manualValidationErrors = {
    title: '',
    year: '',
    rating: ''
  };


  /*
   * Edit state
   */

  editingId?:
    number;

  editForm?:
    Content;

  deletingIds =
    new Set<number>();

  savingEditIds =
    new Set<number>();

  editValidationErrors = {
    title: '',
    year: '',
    rating: ''
  };


  /*
   * Saved content filters
   */

  libraryTitle = '';

  libraryGenre = '';

  libraryMinRating:
    number | null =
    null;

  sortBy =
    'createdAt';

  sortDir =
    'desc';

  pageSize = 4;

  currentPage = 0;

  totalPages = 0;

  totalElements = 0;


  /*
   * OMDb search race protection
   */

  private searchSubject =
    new Subject<string>();

  private searchSubscription?:
    Subscription;

  private searchSequence = 0;


  constructor(
    private contentService:
    ContentService,

    private authService:
    AuthService,

    private changeDetectorRef:
    ChangeDetectorRef,

    private router:
    Router
  ) {}


  ngOnInit(): void {

    this.loadContents();


    this.searchSubscription =
      this.searchSubject
        .pipe(

          debounceTime(250),

          switchMap(
            (title) => {

              const searchId =
                ++this.searchSequence;


              this.loading =
                true;

              this.errorMessage =
                '';

              this.successMessage =
                '';

              this.searchResult =
                undefined;


              this.changeDetectorRef
                .markForCheck();


              return this
                .contentService
                .searchMovie(
                  title
                )
                .pipe(

                  catchError(
                    (
                      error:
                      HttpErrorResponse
                    ) => {

                      if (
                        searchId ===
                        this.searchSequence
                      ) {

                        this.errorMessage =
                          this
                            .getSearchErrorMessage(
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

                  finalize(
                    () => {

                      if (
                        searchId ===
                        this.searchSequence
                      ) {

                        this.loading =
                          false;

                        this.changeDetectorRef
                          .markForCheck();

                      }

                    }
                  )

                );

            }
          )

        )
        .subscribe(
          (movie) => {

            this.searchResult =
              movie;

            this.errorMessage =
              '';


            this.changeDetectorRef
              .markForCheck();

          }
        );

  }


  ngOnDestroy(): void {

    this.searchSubscription
      ?.unsubscribe();

  }


  get isAdmin(): boolean {

    return this.authService
      .isAdmin();

  }


  get currentEmail():
    string {

    return (
      this.authService
        .getEmail() ??
      ''
    );

  }


  get currentRole():
    string {

    return (
      this.authService
        .getRole() ??
      ''
    );

  }


  get displayedPage():
    number {

    if (
      this.totalPages === 0
    ) {

      return 0;

    }


    return (
      this.currentPage +
      1
    );

  }


  /*
   * Library
   */

  loadContents(): void {

    this.contentService
      .getContentsPage(

        this.libraryTitle
          .trim(),

        this.libraryGenre
          .trim(),

        this.libraryMinRating,

        this.currentPage,

        this.pageSize,

        this.sortBy,

        this.sortDir

      )
      .subscribe({

        next: (
          data
        ) => {

          this.contents =
            data.content;

          this.currentPage =
            data.page;

          this.totalPages =
            data.totalPages;

          this.totalElements =
            data.totalElements;


          /*
           * Last item on a page
           * may have been deleted.
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
          error:
          HttpErrorResponse
        ) => {

          this.errorMessage =
            this
              .getGeneralErrorMessage(
                error,
                'Saved content could not be loaded.'
              );


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  applyLibraryFilters():
    void {

    this.currentPage =
      0;

    this.errorMessage =
      '';

    this.successMessage =
      '';

    this.loadContents();

  }


  clearLibraryFilters():
    void {

    this.libraryTitle =
      '';

    this.libraryGenre =
      '';

    this.libraryMinRating =
      null;

    this.sortBy =
      'createdAt';

    this.sortDir =
      'desc';

    this.pageSize =
      4;

    this.currentPage =
      0;


    this.loadContents();

  }


  previousPage():
    void {

    if (
      this.currentPage <= 0
    ) {

      return;

    }


    this.currentPage--;

    this.loadContents();

  }


  nextPage():
    void {

    if (
      this.currentPage >=
      this.totalPages - 1
    ) {

      return;

    }


    this.currentPage++;

    this.loadContents();

  }


  /*
   * Account
   */
  goToActors(): void {

    this.router.navigate([
      '/actors'
    ]);
  }

  goToCategories(): void {

    this.router.navigate([
      '/categories'
    ]);
  }

  logout(): void {

    this.authService
      .logout();


    this.router
      .navigate([
        '/login'
      ]);

  }


  /*
   * OMDb
   */

  searchMovie(): void {

    const title =
      this.searchTitle
        .trim();


    if (!title) {

      this.errorMessage =
        'Please enter a movie title.';

      return;

    }


    this.searchSubject
      .next(
        title
      );

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
      this.searchResult
        .Title;


    this.adding =
      true;

    this.errorMessage =
      '';

    this.successMessage =
      '';


    this.changeDetectorRef
      .markForCheck();


    this.contentService
      .importMovie(
        movieTitle
      )
      .pipe(

        finalize(
          () => {

            this.adding =
              false;


            this.changeDetectorRef
              .markForCheck();

          }
        )

      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Movie added successfully.';

          this.errorMessage =
            '';


          if (
            this.searchResult
              ?.Title ===
            movieTitle
          ) {

            this.searchResult =
              undefined;

            this.searchTitle =
              '';

          }


          this.currentPage =
            0;

          this.loadContents();


          this.changeDetectorRef
            .markForCheck();

        },


        error: (
          error:
          HttpErrorResponse
        ) => {

          if (
            error.status ===
            409
          ) {

            this.errorMessage =
              error.error
                ?.message ??
              'This movie is already in your library.';

          } else if (
            error.status ===
            403
          ) {

            this.errorMessage =
              'You do not have permission to add movies.';

          } else {

            this.errorMessage =
              this
                .getGeneralErrorMessage(
                  error,
                  'Movie could not be added.'
                );

          }


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  /*
   * Manual content
   */

  toggleManualForm():
    void {

    if (
      !this.isAdmin
    ) {

      return;

    }


    this.showManualForm =
      !this.showManualForm;

    this.errorMessage =
      '';

    this.successMessage =
      '';

  }


  resetManualForm():
    void {

    this.manualForm =
      this
        .createEmptyManualForm();


    this.manualValidationErrors = {
      title: '',
      year: '',
      rating: ''
    };

  }


  createManualContent():
    void {

    if (
      !this.isAdmin ||
      this.manualSaving
    ) {

      return;

    }


    if (
      !this
        .validateManualForm()
    ) {

      return;

    }


    const payload:
      Content = {

      ...this.manualForm,

      title:
        this.manualForm
          .title
          .trim(),

      type:
        this.manualForm
          .type ??
        'MOVIE'

    };


    this.manualSaving =
      true;

    this.errorMessage =
      '';

    this.successMessage =
      '';


    this.changeDetectorRef
      .markForCheck();


    this.contentService
      .createContent(
        payload
      )
      .pipe(

        finalize(
          () => {

            this.manualSaving =
              false;


            this.changeDetectorRef
              .markForCheck();

          }
        )

      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Content added successfully.';

          this.errorMessage =
            '';

          this.resetManualForm();

          this.showManualForm =
            false;

          this.currentPage =
            0;

          this.loadContents();


          this.changeDetectorRef
            .markForCheck();

        },


        error: (
          error:
          HttpErrorResponse
        ) => {

          if (
            error.status ===
            409
          ) {

            this.errorMessage =
              error.error
                ?.message ??
              'This content already exists.';

          } else if (
            error.status ===
            403
          ) {

            this.errorMessage =
              'You do not have permission to add content.';

          } else if (
            error.status ===
            400
          ) {

            this.errorMessage =
              error.error
                ?.message ??
              'Please check the entered values.';

          } else {

            this.errorMessage =
              this
                .getGeneralErrorMessage(
                  error,
                  'Content could not be added.'
                );

          }


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  private createEmptyManualForm():
    Content {

    return {
      title: '',
      year: null,
      genre: '',
      rating: null,
      plot: '',
      poster: '',
      director: '',
      type: 'MOVIE',
      version: 0
    };

  }


  private validateManualForm():
    boolean {

    this.manualValidationErrors = {
      title: '',
      year: '',
      rating: ''
    };


    const title =
      this.manualForm
        .title
        ?.trim() ??
      '';

    const year =
      this.manualForm
        .year;

    const rating =
      this.manualForm
        .rating;


    if (!title) {

      this.manualValidationErrors
        .title =
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

      this.manualValidationErrors
        .year =
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

      this.manualValidationErrors
        .rating =
        'Rating must be between 0 and 10.';

    }


    return (
      !this.manualValidationErrors
        .title &&
      !this.manualValidationErrors
        .year &&
      !this.manualValidationErrors
        .rating
    );

  }


  /*
   * Delete
   */

  deleteMovie(
    id?: number
  ): void {

    if (
      id === undefined ||
      this.deletingIds
        .has(id) ||
      !this.isAdmin
    ) {

      return;

    }


    const confirmed =
      window.confirm(
        'Are you sure you want to delete this content?'
      );


    if (
      !confirmed
    ) {

      return;

    }


    this.deletingIds
      .add(
        id
      );

    this.errorMessage =
      '';

    this.successMessage =
      '';


    this.changeDetectorRef
      .markForCheck();


    this.contentService
      .deleteContent(
        id
      )
      .pipe(

        finalize(
          () => {

            this.deletingIds
              .delete(
                id
              );


            this.changeDetectorRef
              .markForCheck();

          }
        )

      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Content deleted successfully.';

          this.errorMessage =
            '';

          this.loadContents();


          this.changeDetectorRef
            .markForCheck();

        },


        error: (
          error:
          HttpErrorResponse
        ) => {

          this.errorMessage =
            this
              .getGeneralErrorMessage(
                error,
                'Content could not be deleted.'
              );


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
      this.deletingIds
        .has(id)
    );

  }


  /*
   * Edit
   */

  startEdit(
    movie:
    Content
  ): void {

    if (
      !this.isAdmin
    ) {

      return;

    }


    this.editingId =
      movie.id;


    this.editForm = {

      ...movie,

      type:
        movie.type ??
        'MOVIE'

    };


    this.editValidationErrors = {
      title: '',
      year: '',
      rating: ''
    };


    this.errorMessage =
      '';

    this.successMessage =
      '';

  }


  cancelEdit():
    void {

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


  private validateEditForm():
    boolean {

    if (
      !this.editForm
    ) {

      return false;

    }


    this.editValidationErrors = {
      title: '',
      year: '',
      rating: ''
    };


    const title =
      this.editForm
        .title
        ?.trim() ??
      '';

    const year =
      this.editForm
        .year;

    const rating =
      this.editForm
        .rating;


    if (!title) {

      this.editValidationErrors
        .title =
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

      this.editValidationErrors
        .year =
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

      this.editValidationErrors
        .rating =
        'Rating must be between 0 and 10.';

    }


    return (
      !this.editValidationErrors
        .title &&
      !this.editValidationErrors
        .year &&
      !this.editValidationErrors
        .rating
    );

  }


  saveEdit():
    void {

    if (
      this.editingId ===
      undefined ||
      !this.editForm ||
      !this.isAdmin
    ) {

      return;

    }


    if (
      !this
        .validateEditForm()
    ) {

      return;

    }


    const contentId =
      this.editingId;


    if (
      this.savingEditIds
        .has(
          contentId
        )
    ) {

      return;

    }


    const payload:
      Content = {

      ...this.editForm,

      title:
        this.editForm
          .title
          .trim(),

      type:
        this.editForm
          .type ??
        'MOVIE'

    };


    this.savingEditIds
      .add(
        contentId
      );

    this.errorMessage =
      '';

    this.successMessage =
      '';


    this.changeDetectorRef
      .markForCheck();


    this.contentService
      .updateContent(
        contentId,
        payload
      )
      .pipe(

        finalize(
          () => {

            this.savingEditIds
              .delete(
                contentId
              );


            this.changeDetectorRef
              .markForCheck();

          }
        )

      )
      .subscribe({

        next: (
          updatedContent
        ) => {

          this.contents =
            this.contents
              .map(
                content =>

                  content.id ===
                  contentId

                    ? updatedContent

                    : content
              );


          /*
           * Important:
           * Only close the form if the user
           * is still editing this same item.
           */
          if (
            this.editingId ===
            contentId
          ) {

            this.cancelEdit();

          }


          this.successMessage =
            'Content updated successfully.';

          this.errorMessage =
            '';


          this.changeDetectorRef
            .markForCheck();

        },


        error: (
          error:
          HttpErrorResponse
        ) => {

          if (
            error.status ===
            409
          ) {

            this.errorMessage =
              error.error
                ?.message ??
              'This content was changed by another user. Reload and try again.';

          } else if (
            error.status ===
            400
          ) {

            this.errorMessage =
              error.error
                ?.message ??
              'Please check the entered values.';

          } else if (
            error.status ===
            403
          ) {

            this.errorMessage =
              'You do not have permission to edit content.';

          } else {

            this.errorMessage =
              this
                .getGeneralErrorMessage(
                  error,
                  'Content could not be updated.'
                );

          }


          this.changeDetectorRef
            .markForCheck();

        }

      });

  }


  isSavingEdit(
    id?: number
  ): boolean {

    return (
      id !== undefined &&
      this.savingEditIds
        .has(id)
    );

  }


  /*
   * Errors
   */

  private getSearchErrorMessage(
    error:
    HttpErrorResponse
  ): string {

    if (
      error.status ===
      404
    ) {

      return (
        error.error
          ?.message ??
        'Movie not found.'
      );

    }


    if (
      error.status ===
      0
    ) {

      return (
        'The movie service could not be reached.'
      );

    }


    if (
      error.status ===
      429
    ) {

      return (
        'Too many requests. Please try again shortly.'
      );

    }


    if (
      error.status >=
      500
    ) {

      return (
        'The movie service is temporarily unavailable.'
      );

    }


    return (
      error.error
        ?.message ??
      'Movie search failed.'
    );

  }


  private getGeneralErrorMessage(
    error:
    HttpErrorResponse,

    fallback:
    string
  ): string {

    if (
      error.status ===
      0
    ) {

      return (
        'The server could not be reached.'
      );

    }


    if (
      error.status ===
      401
    ) {

      return (
        'Your session is no longer valid. Please log in again.'
      );

    }


    if (
      error.status ===
      403
    ) {

      return (
        'You do not have permission to perform this action.'
      );

    }


    if (
      error.status >=
      500
    ) {

      return (
        'The server encountered an error. Please try again.'
      );

    }


    return (
      error.error
        ?.message ??
      fallback
    );

  }

}
