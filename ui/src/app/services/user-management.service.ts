import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../environments/environment';

import {
  ManagedUser,
  UserRole
} from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  private readonly apiUrl =
    environment.authApiUrl.replace(
      '/api/auth',
      '/api/admin/users'
    );


  constructor(
    private http: HttpClient
  ) {}


  getUsers():
    Observable<ManagedUser[]> {

    return this.http
      .get<ManagedUser[]>(
        this.apiUrl
      );
  }


  changeRole(
    userId: number,
    role: UserRole
  ): Observable<ManagedUser> {

    return this.http
      .patch<ManagedUser>(
        `${this.apiUrl}/${userId}/role`,
        {
          role
        }
      );
  }


  changeEnabled(
    userId: number,
    enabled: boolean
  ): Observable<ManagedUser> {

    return this.http
      .patch<ManagedUser>(
        `${this.apiUrl}/${userId}/enabled`,
        {
          enabled
        }
      );
  }
}
