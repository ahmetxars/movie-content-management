import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

import { Content } from '../models/content.model';
import { ContentPage } from '../models/content-page.model';
import { OmdbMovie } from '../models/omdb-movie.model';


@Injectable({
  providedIn: 'root'
})
export class ContentService {

  private readonly apiUrl =
    environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  getAllContents():
    Observable<Content[]> {

    return this.http.get<Content[]>(
      this.apiUrl
    );

  }


  getContentsPage(
    title: string,
    genre: string,
    minRating: number | null,
    page: number,
    size: number,
    sortBy: string,
    sortDir: string
  ): Observable<ContentPage> {

    let params =
      new HttpParams()
        .set(
          'title',
          title
        )
        .set(
          'genre',
          genre
        )
        .set(
          'page',
          page
        )
        .set(
          'size',
          size
        )
        .set(
          'sortBy',
          sortBy
        )
        .set(
          'sortDir',
          sortDir
        );


    if (
      minRating !== null
    ) {

      params =
        params.set(
          'minRating',
          minRating
        );

    }


    return this.http
      .get<ContentPage>(
        `${this.apiUrl}/page`,
        {
          params
        }
      );

  }


  getContentById(
    id: number
  ): Observable<Content> {

    return this.http
      .get<Content>(
        `${this.apiUrl}/${id}`
      );

  }


  createContent(
    content: Content
  ): Observable<Content> {

    const {
      id,
      createdAt,
      version,
      ...rest
    } = content;


    const payload = {
      ...rest,

      type:
        content.type ??
        'MOVIE'
    };


    return this.http
      .post<Content>(
        this.apiUrl,
        payload
      );

  }


  updateContent(
    id: number,
    content: Content
  ): Observable<Content> {

    const {
      id: ignoredId,
      createdAt,
      ...rest
    } = content;


    const payload = {
      ...rest,

      type:
        content.type ??
        'MOVIE'
    };


    return this.http
      .put<Content>(
        `${this.apiUrl}/${id}`,
        payload
      );

  }


  deleteContent(
    id: number
  ): Observable<void> {

    return this.http
      .delete<void>(
        `${this.apiUrl}/${id}`
      );

  }


  searchMovie(
    title: string
  ): Observable<OmdbMovie> {

    return this.http
      .get<OmdbMovie>(
        `${this.apiUrl}/search`,
        {
          params: {
            title
          }
        }
      );

  }


  importMovie(
    title: string
  ): Observable<Content> {

    return this.http
      .post<Content>(
        `${this.apiUrl}/import`,
        null,
        {
          params: {
            title
          }
        }
      );

  }

}
