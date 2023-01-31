import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../_services/alert.service';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Message } from '../interfaces/message';

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
  message: any[];
  text: string;

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token',
      'Content-Disposition': 'multipart/form-data',
    })
  };

  //TODO - Mudar controller?
  async postFile(file: File, pass) {
    const url = `${GlobalConstants.apiURL}/file/`; // POST api/file
    const formData: FormData = new FormData();
    formData.append('fileup', file);
    formData.append('pass', pass);
    const params = new HttpParams();
    const headers = new HttpHeaders();
    // add this to be able to show progress on interface
    params.set('reportProgress', 'true');
    params.set('observe', 'events');
    headers.set('Access-Control-Allow-Origin', '*');
    
    //TODO - Revisar isso - (Ariane) try to fix cors error
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    try {
      const response = await this.http.post(url, formData, { params, headers });

      return response.toPromise();
    } catch (error) {
      await this.handleError(error);
    }
  }

  getMessagesByType($type): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/message/${$type}`; // get api/messages/{inbox/outbox/draft}
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

  //TODO - MUDAR DE ARQUIVO? (Tratar como file)
  getMessageImage(id: number): Observable<Blob> {
    const url = `${GlobalConstants.apiURL}/message/image/${id}`; // get /message/image/42
    return this.http.get(url, { responseType: 'blob' });
  }

  deleteMessage(id): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/message/${id}`; // DELETE /message/42
    return this.http.delete(url).pipe(
      map((res: any) => {
        return this.messages;
      }),
      catchError(this.handleError));
  }

  uncrypt(id: number, values): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/uncrypt/${id}`;
    return this.http.post<Message>(url, values).pipe(
      map((res: any) => {
        this.text = res;
        return this.text;
      }),
      catchError(this.handleError));
  }

  sendMessage(message: Message, origin: any): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/message`; // POST /message
    message.draft = false;
    message.sent_at = Date();
    message.orig = origin;
    return this.http.post<Message>(url, message).pipe(
      map((res: any) => {
        this.message = res;
        return this.message;
      }),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    this.message = [];
    return throwError(error);
  }
}

