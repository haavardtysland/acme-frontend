import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { environment } from './../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private http: HttpClient) {}

  getTrips(): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips`;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('getTrips')));
  }

  getTripById(id: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips/${id}`;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('getTripById')));
  }

  getTripByManagerId(id: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Managers/${id}/Trips`;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('getTripByManagerId')));
  }

  getTripByExlorerId(id: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Actors/${id}/Trips`;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('getTripByExlorerId')));
  }

  getTripsBySearchword(word: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips/Search/${word}`;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('getTripsBySearchword')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(error as T);
    };
  }
}
