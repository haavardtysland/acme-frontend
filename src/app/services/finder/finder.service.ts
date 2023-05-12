import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Finder } from 'src/app/models/finder.model';
import { AuthService } from '../auth.service';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FinderService implements OnInit {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }),
    };
  }

  getFinder(id: string): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Actors/${id}`;
    return this.http
      .get(url, this.getHttpOptions())
      .pipe(catchError(this.handleError('getFinder')));
  }

  updateFinder(finder: Finder): Observable<any> {
    const url = `${environment.backendApiBaseUrl}/Finder`;
    const body = Finder.toJson(finder);
    return this.http
      .put(url, body, this.getHttpOptions())
      .pipe(catchError(this.handleError('updateFinder')));
  }

  searchTrips(finder: Finder): Observable<any> {
    const { keyWord, fromDate, toDate, fromPrice, toPrice } = finder;

    let queryParameters = '';

    if (keyWord !== null) {
      queryParameters += `&keyWord=${keyWord}`;
    }

    if (fromDate !== null) {
      queryParameters += `&fromDate=${fromDate}`;
    }

    if (toDate !== null) {
      queryParameters += `&toDate=${toDate}`;
    }

    if (fromPrice !== null) {
      queryParameters += `&fromPrice=${fromPrice}`;
    }

    if (toPrice !== null) {
      queryParameters += `&toPrice=${toPrice}`;
    }

    let cacheDuration = 3600;
    try {
      cacheDuration = this.authService.getCurrentActor().cacheDuration * 3600;
    } catch {}
    const headers: HttpHeaders = this.getHttpOptions().headers.append(
      'Cache-Control',
      `max-age=${cacheDuration}, public`
    );
    console.log(headers);

    const url = `${
      environment.backendApiBaseUrl
    }/Finder/Search?${queryParameters.slice(1)}`;
    return this.http
      .get(url, { headers })
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
