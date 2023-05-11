import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Trip } from 'src/app/models/trip.model';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  constructor(private http: HttpClient) {}

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': 'http://localhost:4200',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }),
    };
  }

  getTrips(): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips`;
    return this.http
      .get(url, this.getHttpOptions())
      .pipe(catchError(this.handleError('getTrips')));
  }

  getTripById(id: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips/${id}`;
    return this.http
      .get(url, this.getHttpOptions())
      .pipe(catchError(this.handleError('getTripById')));
  }

  getTripByManagerId(id: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Managers/${id}/Trips`;
    return this.http
      .get(url, this.getHttpOptions())
      .pipe(catchError(this.handleError('getTripByManagerId')));
  }

  getTripByExlorerId(id: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Actors/${id}/Trips`;
    return this.http
      .get(url, this.getHttpOptions())
      .pipe(catchError(this.handleError('getTripByExlorerId')));
  }

  getTripsBySearchword(word: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips/Search/${word}`;
    return this.http
      .get(url, this.getHttpOptions())
      .pipe(catchError(this.handleError('getTripsBySearchword')));
  }

  payTrip(applicationId: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Trips/Applications/${applicationId}/Pay`;
    return this.http
      .post(url, {}, this.getHttpOptions())
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
      .post(url, body, this.getHttpOptions())
      .pipe(catchError(this.handleError('cancelApplication')));
  }

  changeApplicationStatus(
    applicationId: string,
    status: string,
    description: string
  ) {
    const url = `${environment.backendApiBaseUrl}/Trips/Application/${applicationId}/Status`;

    var obj = {
      status,
      description,
    };
    obj.status = status;
    obj.description = description;

    const body = JSON.stringify(obj);
    return this.http
      .put(url, body, this.getHttpOptions())
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
    console.log(localStorage.getItem('token'));
    console.log(this.getHttpOptions());
    return this.http
      .post(url, body, this.getHttpOptions())
      .pipe(catchError(this.handleError('applyForTrip')));
  }
  createTrip(trip: Trip) {
    const url = `${environment.backendApiBaseUrl}/Trips`;
    const body = Trip.toJson(trip);
    return this.http
      .post(url, body, this.getHttpOptions())
      .pipe(catchError(this.handleError('createTrip')));
  }

  editTrip(trip: Trip) {
    const url = `${environment.backendApiBaseUrl}/Trips/${trip._id}`;
    const body = Trip.toJson(trip);
    return this.http
      .put(url, body, this.getHttpOptions())
      .pipe(catchError(this.handleError('editTrip')));
  }

  cancelTrip(trip: Trip) {
    const url = `${environment.backendApiBaseUrl}/Trips/${trip._id}/Status`;
    return this.http
      .put(url, this.getHttpOptions())
      .pipe(catchError(this.handleError('cancelTrip')));
  }

  deleteTrip(trip: Trip) {
    const url = `${environment.backendApiBaseUrl}/Trips/${trip._id}`;
    return this.http
      .delete(url, this.getHttpOptions())
      .pipe(catchError(this.handleError('cancelTrip')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(error as T);
    };
  }
}
