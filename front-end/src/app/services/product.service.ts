import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  targetPrice: number;
  lowestPrice?: number;
  urls?: ProductUrl[];
}

export interface ProductUrl {
  storeId: number;
  url: string;
}

export interface InsertProductRequest {
  name: string;
  targetPrice?: number;
  urls: ProductUrl[];
}

export interface UpdateProductRequest {
  name?: string;
  targetPrice?: number;
  urls?: ProductUrl[];
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:3000/api/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(catchError(this.handleError));
  }

  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  insertProduct(product: InsertProductRequest): Observable<any> {
    return this.http.post(this.apiUrl, product).pipe(catchError(this.handleError));
  }

  updateProduct(id: number, product: UpdateProductRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, product).pipe(catchError(this.handleError));
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
