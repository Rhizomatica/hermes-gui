import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Api } from './api';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) { }

  apis: Api[];
    private baseURL = 'http://floresta.hermes.radio:1011/api.php';

    getApi(): Observable<Api[]> {
      return this.http.get(this.baseURL).pipe(
        map((res: any) => {
          this.apis = res;
          console.log(this.apis);
          return this.apis;
      }),
      catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
      console.log(error);
      // return an observable with a user friendly message
      return throwError('Error! something went wrong: ');
    }

    private log(message: string) {
      this.alertService.add(`Api: ${message}`);
    }
}
