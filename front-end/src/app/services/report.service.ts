import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Report {
  id: number;
  productId: number;
  storeId: number;
  averagePrice: number;
  date: string;
  product?: { name: string };
  store?: { name: string };
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:3000/api/reports';

  constructor(private http: HttpClient) {}

  getHourlyReports(
    startDate?: string,
    endDate?: string,
    productId?: number,
    storeId?: number
  ): Observable<Report[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (productId) params = params.set('productId', productId.toString());
    if (storeId) params = params.set('storeId', storeId.toString());
    return this.http
      .get<Report[]>(`${this.apiUrl}/hourly`, { params })
      .pipe(catchError(this.handleError));
  }

  getDailyReports(
    startDate?: string,
    endDate?: string,
    productId?: number,
    storeId?: number
  ): Observable<Report[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (productId) params = params.set('productId', productId.toString());
    if (storeId) params = params.set('storeId', storeId.toString());
    return this.http
      .get<Report[]>(`${this.apiUrl}/daily`, { params })
      .pipe(catchError(this.handleError));
  }

  getMonthlyReports(
    startDate?: string,
    endDate?: string,
    productId?: number,
    storeId?: number
  ): Observable<Report[]> {
    let params = new HttpParams();
    if (startDate) params = params.set('startDate', startDate);
    if (endDate) params = params.set('endDate', endDate);
    if (productId) params = params.set('productId', productId.toString());
    if (storeId) params = params.set('storeId', storeId.toString());
    return this.http
      .get<Report[]>(`${this.apiUrl}/monthly`, { params })
      .pipe(catchError(this.handleError));
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
