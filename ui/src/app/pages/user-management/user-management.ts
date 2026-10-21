import {
  ChangeDetectorRef,
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
  HttpErrorResponse
} from '@angular/common/http';

import {
  Router
} from '@angular/router';

import {
  finalize
} from 'rxjs/operators';

import {
  ManagedUser,
  UserRole
} from '../../models/user.model';

import {
  UserManagementService
} from '../../services/user-management.service';

import {
  AuthService
} from '../../services/auth.service';


@Component({
  selector: 'app-user-management',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './user-management.html',

  styleUrl:
    './user-management.scss'
})
export class UserManagement
  implements OnInit {

  users:
    ManagedUser[] = [];

  loading = false;

  updatingIds =
    new Set<number>();

  errorMessage = '';

  successMessage = '';


  constructor(
    private userManagementService:
    UserManagementService,

    private authService:
    AuthService,

    private router:
    Router,

    private changeDetectorRef:
    ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadUsers();
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


  loadUsers(): void {

    this.loading =
      true;

    this.clearMessages();


    this.userManagementService
      .getUsers()
      .pipe(
        finalize(() => {

          this.loading =
            false;

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: users => {

          this.users =
            users;

          this.changeDetectorRef
            .markForCheck();
        },


        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Users could not be loaded.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }


  changeRole(
    user: ManagedUser,
    newRole: UserRole
  ): void {

    if (
      user.role === newRole ||
      this.isUpdating(user.id)
    ) {

      return;
    }


    this.updatingIds.add(
      user.id
    );

    this.clearMessages();


    this.userManagementService
      .changeRole(
        user.id,
        newRole
      )
      .pipe(
        finalize(() => {

          this.updatingIds
            .delete(
              user.id
            );

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: updated => {

          this.replaceUser(
            updated
          );

          this.successMessage =
            'User role updated successfully.';

          this.changeDetectorRef
            .markForCheck();
        },


        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'User role could not be updated.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }


  toggleEnabled(
    user: ManagedUser
  ): void {

    if (
      this.isUpdating(
        user.id
      )
    ) {

      return;
    }


    const nextEnabled =
      !user.enabled;


    this.updatingIds.add(
      user.id
    );

    this.clearMessages();


    this.userManagementService
      .changeEnabled(
        user.id,
        nextEnabled
      )
      .pipe(
        finalize(() => {

          this.updatingIds
            .delete(
              user.id
            );

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: updated => {

          this.replaceUser(
            updated
          );

          this.successMessage =
            updated.enabled
              ? 'User enabled successfully.'
              : 'User disabled successfully.';

          this.changeDetectorRef
            .markForCheck();
        },


        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'User status could not be updated.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }


  isSelf(
    user: ManagedUser
  ): boolean {

    return (
      user.email
        .toLowerCase() ===
      this.currentEmail
        .toLowerCase()
    );
  }


  isUpdating(
    userId: number
  ): boolean {

    return this.updatingIds
      .has(userId);
  }


  goToMovies(): void {

    this.router.navigate([
      '/movies'
    ]);
  }


  goToCategories(): void {

    this.router.navigate([
      '/categories'
    ]);
  }


  goToActors(): void {

    this.router.navigate([
      '/actors'
    ]);
  }


  logout(): void {

    this.authService
      .logout();

    this.router.navigate([
      '/login'
    ]);
  }


  private replaceUser(
    updatedUser:
    ManagedUser
  ): void {

    this.users =
      this.users.map(
        user =>
          user.id ===
          updatedUser.id

            ? updatedUser
            : user
      );
  }


  private clearMessages():
    void {

    this.errorMessage = '';

    this.successMessage = '';
  }


  private getErrorMessage(
    error:
    HttpErrorResponse,

    fallback:
    string
  ): string {

    if (
      error.status === 403
    ) {

      return (
        'Only administrators can manage users.'
      );
    }


    if (
      error.status === 404
    ) {

      return (
        error.error?.message ??
        'User not found.'
      );
    }


    if (
      error.status === 409
    ) {

      return (
        error.error?.message ??
        'This user change is not allowed.'
      );
    }


    if (
      error.status === 0
    ) {

      return (
        'Backend server could not be reached.'
      );
    }


    return (
      error.error?.message ??
      fallback
    );
  }
}
