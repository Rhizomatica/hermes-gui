import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Observable, throwError, of  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Message } from './message';

import{ GlobalConstants } from './global-constants';
//import { MESSAGES } from './mock-messages';


@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
      private http: HttpClient,
      private alertService: AlertService
    ) { }

    messages: Message[];
    message: Message;
    httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        Authorization: 'my-auth-token'
      })
    };

    /*getMessagesOld(): Observable<Message[]> {
    this.alertService.add('mensagem selecionada');
    return of(MESSAGES);
  }*/

  getMessages(): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/messages`; // DELETE api/message/42
    return this.http.get(url).pipe(
      map((res: any) => {
        this.messages = res;
        return this.messages;
    }),
    catchError(this.handleError));
  }

  /*getMessageOld(id: number): Observable<Message> {
    this.alertService.add('selecionada mensagem id=${id}');
    return of (MESSAGES.find(message => message.id === id));
  }
  */

  getMessage(id: number): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/message/${id}`; // DELETE api/message/42
    console.log ("debug" + url);
      return this.http.get(url).pipe(
      map((res: any) => {
        this.message = res;
        return res;
    }),
    catchError(this.handleError));
  }

  /** DELETE: delete the message from the server */
  deleteMessage(id): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/message/${id}`; // DELETE api/message/42
    console.log(url);
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError));
  }

  // POST: add a new message to the database
  createMessage(message: Message): Observable<Message> {
    const url = `${GlobalConstants.apiURL}/message`; // POST api/message
    return this.http.post<Message>(url, message, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

/** PUT: update a message  */
  updateMessage(message: Message): Observable<Message> {
    //console.log('debug update', message);
    const url = `${GlobalConstants.apiURL}/message/${message.id}`; // PUT api/message/42
    return this.http.put<Message>(url, message, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
}


  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message.
    return throwError(
      'Something bad happened; please try again later.');
  }

  private log(message: string) {
    this.alertService.add(`Users: ${message}`);
  }

}
