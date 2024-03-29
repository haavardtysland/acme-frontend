import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Role } from '../enums/RoleEnum';
import { Actor } from '../models/actor.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, catchError, of, tap } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

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

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Access-Control-Allow-Credentials': 'true',
      }),
      withCredentials: true,
    };
  }

  registerUser(actor: Actor): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${environment.backendApiBaseUrl + '/Actors'}`;
    const body = Actor.toJson(actor);
    return this.http
      .post(url, body, this.getHttpOptions())
      .pipe(catchError(this.handleError('registerUser')));
  }

  registerManager(manager: any): Observable<any> {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${environment.backendApiBaseUrl + '/Manager'}`;
    const body = JSON.stringify(manager);
    return this.http
      .post(url, body, this.getHttpOptions())
      .pipe(catchError(this.handleError('registerManager')));
  }

  getRoles(): string[] {
    return Object.values(Role);
  }

  useRefreshToken() {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');
    const url = `${environment.backendApiBaseUrl + '/refresh-token'}`;
    return this.http.post(url, {}, this.getHttpOptions()).pipe(
      catchError(this.handleError('useRefreshToken')),
      tap((res: any) => {
        this.currentActor = (res as any)['actor'];
        this.loginStatus.next(true);
        this.setCurrentActor((res as any)['actor']);
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
    return this.http.post(url, body, this.getHttpOptions()).pipe(
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
          _id: actor._id,
          name: actor.name,
          surname: actor.surname,
          email: actor.email,
          phone: actor.phone,
          address: actor.address,
          role: actor.role,
          cacheDuration: actor.cacheDuration,
          numTripsFromFinder: actor.numTripsFromFinder,
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
    if (this.currentActor) {
      return this.currentActor;
    } else {
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
  }

  logout() {
    const url = `${environment.backendApiBaseUrl + '/logout'}`;
    localStorage.clear();
    /*     this.setCurrentActor(); */
    this.cookieService.deleteAll();
    this.loginStatus.next(false);
    return this.http.post(url, {}, this.getHttpOptions()).pipe(
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
