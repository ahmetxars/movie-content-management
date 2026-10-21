import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { Category } from '../../models/category.model';
import { Content } from '../../models/content.model';

import { CategoryService } from '../../services/category.service';
import { ContentService } from '../../services/content.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-category-management',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './category-management.html',

  styleUrl:
    './category-management.scss'
})
export class CategoryManagement
  implements OnInit {

  categories:
    Category[] = [];

  contents:
    Content[] = [];

  assignedCategories:
    Category[] = [];

  newCategoryName = '';

  editingId:
    number | null = null;

  editingName = '';

  selectedContentId:
    number | null = null;

  selectedCategoryId:
    number | null = null;

  loading = false;

  savingCategory = false;

  assigning = false;

  deletingIds =
    new Set<number>();

  errorMessage = '';

  successMessage = '';

  constructor(
    private categoryService:
    CategoryService,

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

    this.loadCategories();

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

  get availableCategories():
    Category[] {

    const assignedIds =
      new Set(
        this.assignedCategories.map(
          category =>
            category.id
        )
      );

    return this.categories.filter(
      category =>
        !assignedIds.has(
          category.id
        )
    );
  }

  loadCategories(): void {

    this.loading = true;

    this.categoryService
      .getAllCategories()
      .pipe(
        finalize(() => {

          this.loading = false;

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: categories => {

          this.categories =
            categories;

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Categories could not be loaded.'
            );

          this.changeDetectorRef
            .markForCheck();
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
                (first, second) =>
                  first.title.localeCompare(
                    second.title
                  )
              );

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Content could not be loaded.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }

  createCategory(): void {

    if (
      this.savingCategory
    ) {
      return;
    }

    const name =
      this.newCategoryName.trim();

    if (!name) {

      this.errorMessage =
        'Category name is required.';

      return;
    }

    this.savingCategory = true;

    this.clearMessages();

    this.categoryService
      .createCategory(name)
      .pipe(
        finalize(() => {

          this.savingCategory =
            false;

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: category => {

          this.categories = [
            ...this.categories,
            category
          ].sort(
            (first, second) =>
              first.name.localeCompare(
                second.name
              )
          );

          this.newCategoryName = '';

          this.successMessage =
            'Category created successfully.';

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Category could not be created.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }

  startEdit(
    category: Category
  ): void {

    this.editingId =
      category.id;

    this.editingName =
      category.name;

    this.clearMessages();
  }

  cancelEdit(): void {

    this.editingId = null;

    this.editingName = '';
  }

  saveEdit(
    categoryId: number
  ): void {

    const name =
      this.editingName.trim();

    if (!name) {

      this.errorMessage =
        'Category name is required.';

      return;
    }

    this.savingCategory = true;

    this.clearMessages();

    this.categoryService
      .updateCategory(
        categoryId,
        name
      )
      .pipe(
        finalize(() => {

          this.savingCategory =
            false;

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: updated => {

          this.categories =
            this.categories
              .map(
                category =>
                  category.id ===
                  categoryId
                    ? updated
                    : category
              )
              .sort(
                (first, second) =>
                  first.name.localeCompare(
                    second.name
                  )
              );

          this.assignedCategories =
            this.assignedCategories.map(
              category =>
                category.id ===
                categoryId
                  ? updated
                  : category
            );

          this.cancelEdit();

          this.successMessage =
            'Category updated successfully.';

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Category could not be updated.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }

  deleteCategory(
    category: Category
  ): void {

    if (
      this.deletingIds.has(
        category.id
      )
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Delete "${category.name}" category?`
      );

    if (!confirmed) {
      return;
    }

    this.deletingIds.add(
      category.id
    );

    this.clearMessages();

    this.categoryService
      .deleteCategory(
        category.id
      )
      .pipe(
        finalize(() => {

          this.deletingIds.delete(
            category.id
          );

          this.changeDetectorRef
            .markForCheck();
        })
      )
      .subscribe({

        next: () => {

          this.categories =
            this.categories.filter(
              item =>
                item.id !==
                category.id
            );

          this.assignedCategories =
            this.assignedCategories.filter(
              item =>
                item.id !==
                category.id
            );

          if (
            this.selectedCategoryId ===
            category.id
          ) {

            this.selectedCategoryId =
              null;
          }

          if (
            this.editingId ===
            category.id
          ) {

            this.cancelEdit();
          }

          this.successMessage =
            'Category deleted successfully.';

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Category could not be deleted.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }

  isDeleting(
    categoryId: number
  ): boolean {

    return this.deletingIds.has(
      categoryId
    );
  }

  onContentChange(): void {

    this.selectedCategoryId =
      null;

    this.assignedCategories =
      [];

    if (
      this.selectedContentId === null
    ) {
      return;
    }

    this.loadAssignedCategories();
  }

  loadAssignedCategories():
    void {

    if (
      this.selectedContentId === null
    ) {
      return;
    }

    const contentId =
      this.selectedContentId;

    this.categoryService
      .getCategoriesForContent(
        contentId
      )
      .subscribe({

        next: categories => {

          this.assignedCategories =
            categories;

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Assigned categories could not be loaded.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }

  assignCategory(): void {

    if (
      this.selectedContentId === null ||
      this.selectedCategoryId === null ||
      this.assigning
    ) {

      return;
    }

    const contentId =
      this.selectedContentId;

    const categoryId =
      this.selectedCategoryId;

    this.assigning = true;

    this.clearMessages();

    this.categoryService
      .addCategoryToContent(
        contentId,
        categoryId
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

        next: categories => {

          this.assignedCategories =
            categories;

          this.selectedCategoryId =
            null;

          this.successMessage =
            'Category assigned successfully.';

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Category could not be assigned.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }

  removeCategory(
    categoryId: number
  ): void {

    if (
      this.selectedContentId === null
    ) {
      return;
    }

    const contentId =
      this.selectedContentId;

    this.clearMessages();

    this.categoryService
      .removeCategoryFromContent(
        contentId,
        categoryId
      )
      .subscribe({

        next: categories => {

          this.assignedCategories =
            categories;

          this.successMessage =
            'Category removed successfully.';

          this.changeDetectorRef
            .markForCheck();
        },

        error: error => {

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Category could not be removed.'
            );

          this.changeDetectorRef
            .markForCheck();
        }
      });
  }

  goToMovies(): void {

    this.router.navigate([
      '/movies'
    ]);
  }

  logout(): void {

    this.authService.logout();

    this.router.navigate([
      '/login'
    ]);
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
      error.status === 409
    ) {

      return (
        error.error?.message ??
        'This category already exists.'
      );
    }

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
