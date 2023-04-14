import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Actor } from 'src/app/models/actor.model';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class ActorService {
  private id;
  constructor(private http: HttpClient, private authService: AuthService) {
    this.id = authService.getCurrentActor()._id;
  }

  updateActor(actor: any): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Actors/${this.id}`;
    const body = Actor.toJson(actor);
    return this.http
      .put(url, body, httpOptions)
      .pipe(catchError(this.handleError('updateActor')));
  }

  getAllActors(): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Actors`;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('getAllActors')));
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(error as T);
    };
  }
}
