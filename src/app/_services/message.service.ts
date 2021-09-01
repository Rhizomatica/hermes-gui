import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { Observable, throwError, of  } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Message } from '../message';

import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
      private http: HttpClient,
      private alertService: AlertService
    ) { }

    messages: Message[];
    // message: Message[];
    message: any[];

    httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'my-auth-token',
        'Content-Disposition': 'multipart/form-data',
      })
    };

    /*getMessagesOld(): Observable<Message[]> {
    this.alertService.add('mensagem selecionada');
    return of(MESSAGES);
  }*/

  postFile(file: any) {
    const url = `${GlobalConstants.apiURL}/file/`; // DELETE api/message/42
    // const  url = '//httpbin.org/post';

    const formData: FormData = new FormData();

    formData.append('name', 'teste');
    formData.append('fileup', file);

    const params = new HttpParams();
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    // Authorization: 'my-auth-token'

    return this.http.post(url, formData, {params, headers})
    .pipe(
      map((res: any) => {
        this.messages = res;
        console.log('⚚ message service - postFile: ',res);
        return this.messages;
      }),
      catchError(this.handleError)
      );

    /*
      return this.http.post(url, formData, {params, headers}).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );*/
  }

  getMessages(): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/messages`; // get api/message/42
    return this.http.get(url).pipe(
      map((res: any) => {
        this.messages = res;
        return this.messages;
    }),
      catchError(this.handleError));
  }

  getMessage(id: number): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/message/${id}`; // get /message/42
    return this.http.get(url).pipe(
      map((res: any) => {
        this.message = res;
        return res;
    }),
      catchError(this.handleError));
  }

  getMessageImage(id: number): Observable<Blob> {
    const url = `${GlobalConstants.apiURL}/message/image/${id}`; // get /message/image/42
    console.log ('⚚ message service - getMessageImage: ' + url);
    return this.http.get(url, {responseType: 'blob'});
  }

  getInboxMessages(): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/inbox`; // DELETE api/message/42
    return this.http.get(url).pipe(
      map((res: any) => {
        this.messages = res;
        console.log('⚚ message service - getInboxMessages: ', res);
        return this.messages;
    }),
      catchError(this.handleError));
  }

  getInboxMessage(id: number)  {
    const url = `${GlobalConstants.apiURL}/inbox/${id}`; // get /message/42
    return this.http.get(url).pipe(
      map((res: any) => {
        this.message = res.value;
        return res;
    }),
      catchError(this.handleError));
  }

  /** DELETE: delete the inbox message from the server */
  deleteInboxMessage(id): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/inbox/${id}`; // DELETE /message/42
    return this.http.delete(url).pipe(
      map((res: any) => {
        this.messages = res;
        console.log('⚚ message service - deleteInboxMessage: ',res);
        return this.messages;
    }),
     catchError(this.handleError));
  }

  /** DELETE: consume server to delete message  */
  deleteMessage(id): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/message/${id}`; // DELETE /message/42
    return this.http.delete(url).pipe(
      map((res: any) => {
        this.messages = res;
        console.log('⚚ message service - deleteMessage: ',res);
        return this.messages;
    }),
     catchError(this.handleError));
  }

   /** DELETE: consume server to delete message  */
   transmitNow(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/message/`; // DELETE /message/42
    return this.http.delete(url).pipe(
      map((res: any) => {
        this.messages = res;
        console.log('⚚ message service - transmitNow: ',res);
        return this.messages;
    }),
     catchError(this.handleError));
  }

  // POST: add a new message to the database
  sendMessage(message: Message, file, id): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/message`; // POST /message
    message.draft = false;
    message.sent_at = Date();
    message.orig = GlobalConstants.stationName;
    // messageImage: File;

    if (id){
      message.id = id;
      message.file = file;
    }
    console.log('⚚ message service - sendMessage: ', message);

    return this.http.post<Message>(url, message).pipe(
      map((res: any) => {
        this.message = res;
        return this.message;
    }),
      catchError(this.handleError),
    );
}

/** POST: update a message  */
  updateMessage(message: Message): Observable<Message> {
    const url = `${GlobalConstants.apiURL}/message/${message.id}`; // PUT api/message/42
    return this.http.post<Message>(url, message, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
}

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('⚚ message service - error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);

    }
    // Return an observable with a user-facing error message.
    this.message = [];
    return throwError(
      'Something bad happened; please try again later.');
  }

  private log(message: string) {
    this.alertService.add(`Users: ${message}`);
  }

}
