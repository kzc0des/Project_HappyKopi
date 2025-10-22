import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = environment.apiBaseUrl;

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Generic GET method
  get<T>(path: string, params: HttpParams = new HttpParams()): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`, { headers: this.httpOptions.headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic POST method
  post<T>(path: string, body: object = {}): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, JSON.stringify(body), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic PUT method
  put<T>(path: string, body: object = {}): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, JSON.stringify(body), this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Generic DELETE method
  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${path}`, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('API Error:', error);
    return new Observable<never>(observer => {
      observer.error('Something bad happened; please try again later.');
      observer.complete();
    });
  }
}
