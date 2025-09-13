import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Log {
  id: number;
  message: string;
  severity: string;
  stack: string;
  timestamp: string;
  route?: string;
  method?: string;
  statusCode?: number;
}

@Injectable({
  providedIn: 'root',
})
export class LogService {
  private apiUrl = environment.apiUrl + '/api/logs';

  constructor(private http: HttpClient) {}

  getLogs(filters?: {
    startDate?: string;
    endDate?: string;
    severity?: string;
    productId?: string;
  }): Observable<Log[]> {
    let params = new HttpParams();
    if (filters) {
      if (filters.startDate) params = params.set('startDate', filters.startDate);
      if (filters.endDate) params = params.set('endDate', filters.endDate);
      if (filters.severity) params = params.set('severity', filters.severity);
      if (filters.productId) params = params.set('productId', filters.productId);
    }
    return this.http.get<Log[]>(this.apiUrl, { params }).pipe(catchError(this.handleError));
  }

  deleteAllLogs(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(catchError(this.handleError));
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
