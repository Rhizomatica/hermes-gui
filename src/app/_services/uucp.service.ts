import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { Observable, throwError, of  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UUCPQueue} from '../uucpqueue';

import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class UUCPService{

  constructor(
      private http: HttpClient,
      private alertService: AlertService
  ) {}

    queue: UUCPQueue[];
    job: UUCPQueue;

    httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'my-auth-token',
        'Content-Disposition': 'multipart/form-data',
      })
    };

  getQueue(): Observable<UUCPQueue[]> {
    const url = `${GlobalConstants.apiURL}/sys/uuls`; 
    return this.http.get(url).pipe(
      map((res: any) => {
        this.queue= res;
        return this.queue;
    }),
      catchError(this.handleError));
  }

  cancelTransmission(uuhost, id): Observable<UUCPQueue[]> {
    const url = `${GlobalConstants.apiURL}/sys/uuk/${uuhost}/${id}`; // DELETE /message/42
    return this.http.delete(url).pipe(
      map((res: any) => {
        this.queue= res;
        console.log('⚚ uucp service - canceltransmission: ',res);
        return this.queue;
    }),
     catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('⚚ uucp service - error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    this.queue = [];
    return throwError(
      'Something bad happened; please try again later.');
  }

}
