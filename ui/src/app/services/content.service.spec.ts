import {
  TestBed
} from '@angular/core/testing';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';

import {
  ContentService
} from './content.service';

import {
  environment
} from '../../environments/environment';

import {
  Content
} from '../models/content.model';


describe(
  'ContentService',
  () => {

    let service:
      ContentService;

    let httpMock:
      HttpTestingController;


    const movie: Content = {

      id: 1,

      title: 'Interstellar',

      year: 2014,

      genre: 'Sci-Fi',

      rating: 8.7,

      plot: 'Test plot',

      poster: 'poster.jpg',

      director:
        'Christopher Nolan',

      version: 0

    };


    beforeEach(
      () => {

        TestBed
          .configureTestingModule({

            providers: [

              ContentService,

              provideHttpClient(),

              provideHttpClientTesting()

            ]

          });


        service =
          TestBed.inject(
            ContentService
          );


        httpMock =
          TestBed.inject(
            HttpTestingController
          );

      }
    );


    afterEach(
      () => {

        httpMock.verify();

      }
    );


    it(
      'should search a movie',
      () => {

        service
          .searchMovie(
            'Interstellar'
          )
          .subscribe(
            response => {

              expect(
                response.Title
              )
                .toBe(
                  'Interstellar'
                );

            }
          );


        const request =
          httpMock.expectOne(
            request =>
              request.url ===
              `${environment.apiUrl}/search`
              &&
              request.params.get(
                'title'
              ) ===
              'Interstellar'
          );


        expect(
          request.request.method
        )
          .toBe(
            'GET'
          );


        request.flush({

          Title: 'Interstellar',

          Year: '2014',

          Genre: 'Sci-Fi',

          imdbRating: '8.7',

          Plot: 'Test',

          Poster: 'poster.jpg',

          Director:
            'Christopher Nolan',

          Response: 'True'

        });

      }
    );


    it(
      'should import a movie',
      () => {

        service
          .importMovie(
            'Interstellar'
          )
          .subscribe(
            response => {

              expect(
                response.title
              )
                .toBe(
                  'Interstellar'
                );

            }
          );


        const request =
          httpMock.expectOne(
            request =>
              request.url ===
              `${environment.apiUrl}/import`
          );


        expect(
          request.request.method
        )
          .toBe(
            'POST'
          );


        expect(
          request.request.params.get(
            'title'
          )
        )
          .toBe(
            'Interstellar'
          );


        request.flush(
          movie
        );

      }
    );


    it(
      'should update a movie',
      () => {

        service
          .updateContent(
            1,
            movie
          )
          .subscribe(
            response => {

              expect(
                response.id
              )
                .toBe(
                  1
                );

            }
          );


        const request =
          httpMock.expectOne(
            `${environment.apiUrl}/1`
          );


        expect(
          request.request.method
        )
          .toBe(
            'PUT'
          );


        expect(
          request.request.body.version
        )
          .toBe(
            0
          );


        request.flush(
          movie
        );

      }
    );


    it(
      'should delete a movie',
      () => {

        service
          .deleteContent(1)
          .subscribe();


        const request =
          httpMock.expectOne(
            `${environment.apiUrl}/1`
          );


        expect(
          request.request.method
        )
          .toBe(
            'DELETE'
          );


        request.flush(
          null
        );

      }
    );


    it(
      'should load paginated movies',
      () => {

        service
          .getContentsPage(
            '',
            '',
            null,
            0,
            4,
            'createdAt',
            'desc'
          )
          .subscribe(
            response => {

              expect(
                response.content.length
              )
                .toBe(
                  1
                );

              expect(
                response.totalElements
              )
                .toBe(
                  1
                );

            }
          );


        const request =
          httpMock.expectOne(
            request =>
              request.url ===
              `${environment.apiUrl}/page`
          );


        expect(
          request.request.method
        )
          .toBe(
            'GET'
          );


        request.flush({

          content: [
            movie
          ],

          page: 0,

          size: 4,

          totalElements: 1,

          totalPages: 1,

          first: true,

          last: true

        });

      }
    );

  }
);
