import { Injectable } from '@angular/core';
import { Actor } from '../models/actor.model';
import { Role } from "../enums/RoleEnum";
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { environment } from '../../environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private fireAuth: AngularFireAuth, private http: HttpClient) { }

  registerUser(actor: Actor) {
    return new Promise((resolve, reject) => {
      this.fireAuth.createUserWithEmailAndPassword(actor.email, actor.password)
        .then(_ => {
          // if the authentication was ok, then we proceed
          const headers = new HttpHeaders();
          headers.append('Content-Type', 'application/json');
          const url = `${environment.backendApiBaseUrl + '/actors'}`;
          const body = JSON.stringify(actor);
          this.http.post(url, body, httpOptions).toPromise()
            .then(res => {
              resolve(res);
            }, err => {
              reject(err);
            });
        }).catch(err => {
          reject(err);
        });
    });
  }

  getRoles(): string[] {
    return Object.values(Role);
  }

  login(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.signInWithEmailAndPassword(email, password)
        .then(res => {
          resolve(res);
        }).catch(err => {
          reject(err);
        });
    });
  }
}