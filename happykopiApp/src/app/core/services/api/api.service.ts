import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  // Generic GET method
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { params })
      .pipe(
        catchError(this.handleError) 
      );
  }

  // Generic POST method
  post<T>(path: string, body: any): Observable<T> { 
    let headers = new HttpHeaders();
    let requestBody = body;

    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = body;
    }

    return this.http.post<T>(`${this.baseUrl}/${path}`, requestBody)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic PUT method
  put<T>(path: string, body: any): Observable<T> { 
    let headers = new HttpHeaders();
    let requestBody = body;

    if (body instanceof FormData) {
      requestBody = body;
    } else {
      requestBody = body;
    }

    return this.http.put<T>(`${this.baseUrl}/${path}`, requestBody)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic DELETE method
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error (mula sa handleError):', error); 
    return throwError(() => error);
  }
}