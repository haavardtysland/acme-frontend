import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Finder } from 'src/app/models/finder.model';
import { AuthService } from '../auth.service';
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
export class FinderService implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getFinder(id: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Actors/${id}`;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('getFinder')));
  }

  updateFinder(finder: Finder): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Finder`;
    const body = Finder.toJson(finder);
    return this.http
      .put(url, body, httpOptions)
      .pipe(catchError(this.handleError('updateFinder')));
  }

  searchTrips(finder: Finder): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Finder/Search?keyWord=${finder.keyWord}&fromDate=${finder.fromDate}&toDate=${finder.toDate}&fromPrice=${finder.fromPrice}&toPrice=${finder.toPrice}`;
    return this.http
      .get(url, httpOptions)
      .pipe(catchError(this.handleError('searchTrips')));
  }

  ngOnInit(): void {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(error as T);
    };
  }
}
