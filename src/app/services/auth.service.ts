import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Role } from '../enums/RoleEnum';
import { Actor } from '../models/actor.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, Subject, tap } from 'rxjs';

import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentActor!: Actor;
  private loginStatus = new Subject<Boolean>();
  constructor(private fireAuth: AngularFireAuth, private http: HttpClient) {}

  registerUser(actor: Actor): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${environment.backendApiBaseUrl + '/Actors'}`;
    const body = Actor.toJson(actor);
    return this.http
      .post(url, body, httpOptions)
      .pipe(catchError(this.handleError('registerUser')));
  }

  getRoles(): string[] {
    return Object.values(Role);
  }

  login(email: string, password: string) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${environment.backendApiBaseUrl + '/Actors/Login'}`;
    var obj = {
      email,
      password,
    };
    obj.email = email;
    obj.password = password;
    const body = JSON.stringify(obj);
    return this.http.post(url, body, httpOptions).pipe(
      catchError(this.handleError('loginUser')),
      tap((res: any) => {
        const actor = res['actor'] as Actor;
        localStorage.setItem('actor', JSON.stringify(actor));
        this.currentActor = (res as any)['actor'];
        this.loginStatus.next(true);
      })
    );
  }

  getCurrentActor(): Actor {
    return this.currentActor;
  }

  getStatus(): Observable<Boolean> {
    return this.loginStatus.asObservable();
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(error as T);
    };
  }
}
