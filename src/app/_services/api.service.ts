import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Api } from '../api';
import { GlobalConstants } from '../global-constants';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  login = false;
  serverReturn: any;
  error = Error;

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) { }


    public getStatus(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/status`; // get api:sys/status
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          console.log('Hermes server status: ', res);
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    getLogin(plogin, ppassword): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/login`; // get api:sys/status
      const data =  {login: plogin, password: ppassword};
      return this.http.post(url, data[0]).pipe(
        map((res: any) => {
          this.serverReturn = res;
          return this.serverReturn;
        }),
        catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse) {
      console.log("api service handleerror", error);
      // return an observable with a user friendly message
      return throwError('api service Error! something went wrong: ');
    }

    private log(message: string) {
      this.alertService.add(`Api: ${message}`);
    }
}
