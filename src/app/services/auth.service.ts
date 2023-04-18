import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Role } from '../enums/RoleEnum';
import { Actor } from '../models/actor.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, Subject, tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Access-Control-Allow-Credentials': 'true',
  }),
  withCredentials: true,
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentActor!: Actor;
  private loginStatus = new Subject<Boolean>();
  constructor(
    private fireAuth: AngularFireAuth,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

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

  useRefreshToken() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${environment.backendApiBaseUrl + '/refresh-token'}`;
    return this.http.post(url, {}, httpOptions).pipe(
      catchError(this.handleError('useRefreshToken')),
      tap((res: any) => {
        this.currentActor = (res as any)['actor'];
        this.loginStatus.next(true);
      })
    );
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
        this.currentActor = (res as any)['actor'];
        this.loginStatus.next(true);
        this.setCurrentActor((res as any)['actor']);
      })
    );
  }

  setCurrentActor(actor?: Actor) {
    if (actor) {
      localStorage.setItem(
        'currentActor',
        JSON.stringify({
          _id: actor.id,
          name: actor.name,
          surname: actor.surname,
          role: actor.role,
        })
      );
    } else {
      localStorage.removeItem('currentActor');
    }
  }

  checkRole(roles: string): boolean {
    let result = false;
    const currentActor = this.getCurrentActor();
    if (currentActor) {
      if (roles.indexOf(currentActor.role.toString()) !== -1) {
        result = true;
      } else {
        result = false;
      }
    } else {
      result = roles.indexOf('anonymous') !== -1;
    }
    return result;
  }

  getCurrentActor(): Actor {
    return this.currentActor;
  }

  getCurrentActor2(): Actor {
    /* return this.currentActor; */
    let result = null;
    const currentActor = localStorage.getItem('currentActor');
    if (currentActor) {
      result = JSON.parse(currentActor);
    } else {
      let message = 'user not found';
      console.log(message);
    }

    return result;
  }

  logout() {
    const url = `${environment.backendApiBaseUrl + '/logout'}`;
    localStorage.clear();
    this.setCurrentActor();
    this.cookieService.deleteAll();
    this.loginStatus.next(false);
    return this.http.post(url, {}, httpOptions).pipe(
      catchError(this.handleError('logout')),
      tap((res: any) => {
        console.log(res);
      })
    );
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
