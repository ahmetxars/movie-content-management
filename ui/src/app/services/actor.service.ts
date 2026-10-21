import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Actor,
  ActorRequest
} from '../models/actor.model';

import {
  environment
} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ActorService {

  private readonly apiUrl =
    environment.apiUrl;


  constructor(
    private http: HttpClient
  ) {}


  getAllActors():
    Observable<Actor[]> {

    return this.http
      .get<Actor[]>(
        `${this.apiUrl}/actors`
      );
  }


  createActor(
    request: ActorRequest
  ): Observable<Actor> {

    return this.http
      .post<Actor>(
        `${this.apiUrl}/actors`,
        request
      );
  }


  updateActor(
    id: number,
    request: ActorRequest
  ): Observable<Actor> {

    return this.http
      .put<Actor>(
        `${this.apiUrl}/actors/${id}`,
        request
      );
  }


  deleteActor(
    id: number
  ): Observable<void> {

    return this.http
      .delete<void>(
        `${this.apiUrl}/actors/${id}`
      );
  }


  getActorsForContent(
    contentId: number
  ): Observable<Actor[]> {

    return this.http
      .get<Actor[]>(
        `${this.apiUrl}/${contentId}/actors`
      );
  }


  addActorToContent(
    contentId: number,
    actorId: number
  ): Observable<Actor[]> {

    return this.http
      .post<Actor[]>(
        `${this.apiUrl}/${contentId}/actors/${actorId}`,
        null
      );
  }


  removeActorFromContent(
    contentId: number,
    actorId: number
  ): Observable<Actor[]> {

    return this.http
      .delete<Actor[]>(
        `${this.apiUrl}/${contentId}/actors/${actorId}`
      );
  }
}
