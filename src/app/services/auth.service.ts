import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { environment } from 'src/environments/environment.development';
import { Actor } from './../models/actor.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private fireAuth: AngularFireAuth, private http: HttpClient) {}

  registerUser(actor: Actor) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth
        .createUserWithEmailAndPassword(actor.email, actor.password)
        .then((_) => {
          const headers = new HttpHeaders();
          headers.append('Content-Type', 'application/json');
          const url = `${environment.backendApiBaseUrl + '/actors'}`;
          const body = JSON.stringify(actor);
          this.http
            .post(url, body)
            .toPromise()
            .then(
              (res) => {
                resolve(res);
              },
              (err) => {
                reject(err);
              }
            );
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
