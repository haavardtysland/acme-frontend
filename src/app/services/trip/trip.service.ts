import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from './../../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
};

@Injectable({
  providedIn: 'root'
})

export class TripService {

  constructor(private http: HttpClient) { }

  getTrips(): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips`;
    return this.http.get(url, httpOptions).pipe(catchError(this.handleError('getTrips')));
  }

  getTripById(id: string): Observable<any> {
      const url = `${environment.backendApiBaseUrl}/Trips/${id}`;
      return this.http.get(url, httpOptions).pipe(catchError(this.handleError('getTripById')));

  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(error as T);
    };
  }
}
