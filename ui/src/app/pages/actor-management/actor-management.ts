import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import {
  Actor,
  ActorRequest
} from '../../models/actor.model';

import {
  Content
} from '../../models/content.model';

import {
  ActorService
} from '../../services/actor.service';

import {
  ContentService
} from '../../services/content.service';

import {
  AuthService
} from '../../services/auth.service';


@Component({
  selector: 'app-actor-management',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './actor-management.html',

  styleUrl:
    './actor-management.scss'
})
export class ActorManagement
  implements OnInit {

  actors: Actor[] = [];

  contents: Content[] = [];

  assignedActors:
    Actor[] = [];


  name = '';

  birthDate = '';

  biography = '';

  photo = '';


  editingId:
    number | null = null;


  selectedContentId:
    number | null = null;

  selectedActorId:
    number | null = null;


  saving = false;

  assigning = false;

  errorMessage = '';

  successMessage = '';


  constructor(
    private actorService:
    ActorService,

    private contentService:
    ContentService,

    private authService:
    AuthService,

    private router:
    Router,

    private changeDetectorRef:
    ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    this.loadActors();

    this.loadContents();
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


  get availableActors():
    Actor[] {

    const assignedIds =
      new Set(
        this.assignedActors.map(
          actor =>
            actor.id
        )
      );


    return this.actors.filter(
      actor =>
        !assignedIds.has(
          actor.id
        )
    );
  }


  loadActors(): void {

    this.actorService
      .getAllActors()
      .subscribe({

        next: actors => {

          this.actors =
            actors;

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Actors could not be loaded.'
            );
        }
      });
  }


  loadContents(): void {

    this.contentService
      .getAllContents()
      .subscribe({

        next: contents => {

          this.contents =
            contents
              .filter(
                content =>
                  content.id !== undefined
              )
              .sort(
                (a, b) =>
                  a.title.localeCompare(
                    b.title
                  )
              );

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Contents could not be loaded.'
            );
        }
      });
  }


  saveActor(): void {

    if (
      this.saving
    ) {
      return;
    }


    const actorName =
      this.name.trim();


    if (!actorName) {

      this.errorMessage =
        'Actor name is required.';

      return;
    }


    const request:
      ActorRequest = {

      name:
      actorName,

      birthDate:
        this.birthDate ||
        null,

      biography:
        this.biography.trim() ||
        null,

      photo:
        this.photo.trim() ||
        null
    };


    this.saving = true;

    this.clearMessages();


    const request$ =
      this.editingId === null

        ? this.actorService
          .createActor(
            request
          )

        : this.actorService
          .updateActor(
            this.editingId,
            request
          );


    request$
      .pipe(
        finalize(() => {

          this.saving =
            false;

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: () => {

          const wasEditing =
            this.editingId !== null;


          this.resetForm();

          this.loadActors();


          if (
            this.selectedContentId !== null
          ) {

            this.loadAssignedActors();
          }


          this.successMessage =
            wasEditing
              ? 'Actor updated successfully.'
              : 'Actor created successfully.';
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Actor could not be saved.'
            );
        }
      });
  }


  editActor(
    actor: Actor
  ): void {

    this.editingId =
      actor.id;

    this.name =
      actor.name;

    this.birthDate =
      actor.birthDate ??
      '';

    this.biography =
      actor.biography ??
      '';

    this.photo =
      actor.photo ??
      '';

    this.clearMessages();
  }


  cancelEdit(): void {

    this.resetForm();
  }


  deleteActor(
    actor: Actor
  ): void {

    const confirmed =
      window.confirm(
        `Delete "${actor.name}"?`
      );


    if (!confirmed) {
      return;
    }


    this.clearMessages();


    this.actorService
      .deleteActor(
        actor.id
      )
      .subscribe({

        next: () => {

          this.actors =
            this.actors.filter(
              item =>
                item.id !==
                actor.id
            );


          this.assignedActors =
            this.assignedActors.filter(
              item =>
                item.id !==
                actor.id
            );


          if (
            this.editingId ===
            actor.id
          ) {

            this.resetForm();
          }


          this.successMessage =
            'Actor deleted successfully.';

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Actor could not be deleted.'
            );
        }
      });
  }


  onContentChange(): void {

    this.selectedActorId =
      null;

    this.assignedActors =
      [];


    if (
      this.selectedContentId !== null
    ) {

      this.loadAssignedActors();
    }
  }


  loadAssignedActors(): void {

    if (
      this.selectedContentId === null
    ) {
      return;
    }


    this.actorService
      .getActorsForContent(
        this.selectedContentId
      )
      .subscribe({

        next: actors => {

          this.assignedActors =
            actors;

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Assigned actors could not be loaded.'
            );
        }
      });
  }


  assignActor(): void {

    if (
      this.selectedContentId === null ||
      this.selectedActorId === null ||
      this.assigning
    ) {

      return;
    }


    this.assigning = true;

    this.clearMessages();


    this.actorService
      .addActorToContent(
        this.selectedContentId,
        this.selectedActorId
      )
      .pipe(
        finalize(() => {

          this.assigning =
            false;

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: actors => {

          this.assignedActors =
            actors;

          this.selectedActorId =
            null;

          this.successMessage =
            'Actor assigned successfully.';
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Actor could not be assigned.'
            );
        }
      });
  }


  removeActor(
    actorId: number
  ): void {

    if (
      this.selectedContentId === null
    ) {
      return;
    }


    this.clearMessages();


    this.actorService
      .removeActorFromContent(
        this.selectedContentId,
        actorId
      )
      .subscribe({

        next: actors => {

          this.assignedActors =
            actors;

          this.successMessage =
            'Actor removed successfully.';

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Actor could not be removed.'
            );
        }
      });
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


  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
  }


  private resetForm():
    void {

    this.editingId = null;

    this.name = '';

    this.birthDate = '';

    this.biography = '';

    this.photo = '';
  }


  private clearMessages():
    void {

    this.errorMessage = '';

    this.successMessage = '';
  }


  private getErrorMessage(
    error: HttpErrorResponse,
    fallback: string
  ): string {

    if (
      error.status === 403
    ) {

      return (
        'You do not have permission to perform this action.'
      );
    }


    if (
      error.status === 404
    ) {

      return (
        error.error?.message ??
        'The requested item was not found.'
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
