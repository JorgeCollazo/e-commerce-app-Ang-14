import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {Category} from "../models/category";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";

@Injectable({
  providedIn: 'root',
})

export class CategoriesService {

  apiURLCategories = environment.apiURL + '/categories/';

  constructor(private httpService: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.httpService.get<Category[]>(this.apiURLCategories);
  }

  getCategory(categoryId: string): Observable<Category> {
    return this.httpService.get<Category>(`${this.apiURLCategories}` + categoryId);
  }

  createCategory(category: Category): Observable<Category> {
    return this.httpService.post<Category>(this.apiURLCategories, category);
  }

  deleteCategory(categoryId: string): Observable<Category> {
    return this.httpService.delete<Category>(`${this.apiURLCategories}` + categoryId);
  }

  editCategory(category: Category): Observable<Category> {
    return this.httpService.put<Category>(`${this.apiURLCategories}` + category.id, category);
  }
}
