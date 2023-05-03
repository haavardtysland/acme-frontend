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

  payTrip(applicationId: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips/Applications/${applicationId}/Pay`;
    return this.http
      .post(url, httpOptions)
      .pipe(catchError(this.handleError('payTrip')));
  }

  cancelApplication(
    applicationId: string,
    description: string
  ): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips/Applications/${applicationId}/Cancel`;
    var obj = {
      status,
      description,
    };
    obj.status = 'CANCELLED';
    obj.description = description;
    const body = JSON.stringify(obj);

    return this.http
      .post(url, body, httpOptions)
      .pipe(catchError(this.handleError('cancelApplication')));
  }

  changeApplicationStatus(
    applicationId: string,
    status: string,
    description: string
  ) {
    const url = `${environment.backendApiBaseUrl}/Trips/Applications/${applicationId}/Status`;
    var obj = {
      status,
      description,
    };
    obj.status = status;
    obj.description = description;
    const body = JSON.stringify(obj); //SOMETHING WORNG WITH THE POST
    return this.http
      .post(url, body, httpOptions)
      .pipe(catchError(this.handleError('changeApplicationStatus')));
  }

  applyForTrip(tripId: string, comments: string[]): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips/Applications`;
    var obj = {
      tripId,
      comments,
    };
    obj.tripId = tripId;
    obj.comments = comments;
    const body = JSON.stringify(obj);
    return this.http
      .post(url, body, httpOptions)
      .pipe(catchError(this.handleError('applyForTrip')));
  }
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(error as T);
    };
  }
}
