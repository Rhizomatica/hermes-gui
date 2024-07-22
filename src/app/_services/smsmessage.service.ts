import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SMSMessage } from '../interfaces/smsmessage';

import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})

export class SMSMessageService {

  constructor(
    private http: HttpClient
  ) { }

  messages: SMSMessage[];
  message: any[];
  text: string;

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token',
      'Content-Disposition': 'multipart/form-data',
    })
  };

  getMessages(): Observable<SMSMessage[]> {
    const url = `${GlobalConstants.apiURL}/sms/messages/`;
    return this.http.get(url).pipe(
      map((res: any) => {
        this.messages = res;
        return res;
      }),
      catchError(this.handleError));
  }

  sendMessage(message: SMSMessage): Observable<SMSMessage[]> {
    const url = `${GlobalConstants.apiURL}/sms/message`;
    return this.http.post<SMSMessage>(url, message).pipe(
      map((res: any) => {
        this.message = res;
        return this.message;
      }),
      catchError(this.handleError)
    );
  }

  deleteMessage(id: number) {
    const url = `${GlobalConstants.apiURL}/sms/message/${id}`;
    return this.http.delete<SMSMessage>(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    this.message = [];
    return throwError(error);
  }
}

