import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "@env/environment";
import {Product} from "../models/product";

@Injectable({
  providedIn: 'root',
})

export class ProductService {

  apiURLProducts = environment.apiURL + '/products/';

  constructor(private httpService: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.httpService.get<Product[]>(this.apiURLProducts);
  }

  getProduct(productId: string): Observable<Product> {
    return this.httpService.get<Product>(`${this.apiURLProducts}` + productId);
  }

  createProduct(productFormData: FormData): Observable<Product> {
    return this.httpService.post<Product>(this.apiURLProducts, productFormData);
  }

  deleteProduct(productId: string): Observable<Product> {
    return this.httpService.delete<Product>(`${this.apiURLProducts}` + productId);
  }

  editProduct(productFormData: FormData, productId: string): Observable<Product> {
    return this.httpService.put<Product>(`${this.apiURLProducts}` + productId, productFormData);
  }
}
