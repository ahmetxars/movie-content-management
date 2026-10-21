import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private readonly apiUrl =
    environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  getAllCategories():
    Observable<Category[]> {

    return this.http.get<Category[]>(
      `${this.apiUrl}/categories`
    );
  }

  createCategory(
    name: string
  ): Observable<Category> {

    return this.http.post<Category>(
      `${this.apiUrl}/categories`,
      { name }
    );
  }

  updateCategory(
    id: number,
    name: string
  ): Observable<Category> {

    return this.http.put<Category>(
      `${this.apiUrl}/categories/${id}`,
      { name }
    );
  }

  deleteCategory(
    id: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/categories/${id}`
    );
  }

  getCategoriesForContent(
    contentId: number
  ): Observable<Category[]> {

    return this.http.get<Category[]>(
      `${this.apiUrl}/${contentId}/categories`
    );
  }

  addCategoryToContent(
    contentId: number,
    categoryId: number
  ): Observable<Category[]> {

    return this.http.post<Category[]>(
      `${this.apiUrl}/${contentId}/categories/${categoryId}`,
      null
    );
  }

  removeCategoryFromContent(
    contentId: number,
    categoryId: number
  ): Observable<Category[]> {

    return this.http.delete<Category[]>(
      `${this.apiUrl}/${contentId}/categories/${categoryId}`
    );
  }
}
