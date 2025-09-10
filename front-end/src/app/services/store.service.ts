import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Store {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  private apiUrl = 'http://localhost:3000/api/stores';

  constructor(private http: HttpClient) {}

  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.apiUrl).pipe(catchError(this.handleError));
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
