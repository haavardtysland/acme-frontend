import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Role } from '../enums/RoleEnum';
import { Actor } from '../models/actor.model';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth, private http: HttpClient) {}

  registerUser(actor: Actor) {
    return new Promise((resolve, reject) => {
      /*       this.fireAuth
        .createUserWithEmailAndPassword(actor.email, actor.password)
        .then((_) => { */
      // if the authentication was ok, then we proceed
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      const url = `${environment.backendApiBaseUrl + '/Actors'}`;
      const body = actor.getJson();
      console.log(body);
      this.http
        .post(url, body, httpOptions)
        .toPromise()
        .then(
          (res) => {
            console.log(res);
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    }); /* 
        .catch((err) => {
          reject(err);
        }); */
  }

  getRoles(): string[] {
    return Object.values(Role);
  }

  login(email: string, password: string) {
    return new Promise<any>((resolve, reject) => {
      /*   this.fireAuth
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        }); */
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
      console.log(body);
      this.http
        .post(url, body, httpOptions)
        .toPromise()
        .then(
          (res) => {
            console.log(res);
            resolve(res);
          },
          (err) => {
            reject(err);
          }
        );
    });
  }
}
