import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../_services/alert.service';
import { Observable, throwError, lastValueFrom } from 'rxjs'; // Added lastValueFrom
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

  messages!: Message[];
  message!: any[];
  text!: string;

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token',
      'Content-Disposition': 'multipart/form-data',
    })
  };

  /**
   * Corrected postFile using async/await and lastValueFrom.
   * Note: HttpHeaders and HttpParams are immutable, so we chain the .set() methods.
   */
  async postFile(file: File, pass: string) {
    const url = `${GlobalConstants.apiURL}/file/`; 
    
    const formData: FormData = new FormData();
    formData.append('fileup', file);
    formData.append('pass', pass);

    // Correct way to set params and headers (they return new instances)
    const params = new HttpParams()
      .set('reportProgress', 'true')
      .set('observe', 'events');

    const headers = new HttpHeaders()
      .set('Access-Control-Allow-Origin', '*')
      .set('Accept', 'multipart/form-data');

    try {
      // 1. Get the Observable from the HTTP call
      const response$ = this.http.post(url, formData, { params, headers });

      // 2. Convert Observable to Promise using lastValueFrom and await it
      return await lastValueFrom(response$);
    } catch (error) {
      // Re-throwing or handling the error for the component to catch
      return this.handleError(error as HttpErrorResponse);
    }
  }

  getMessagesByType($type: string): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/message/type/${$type}`; 
    return this.http.get(url).pipe(
      map((res: any) => {
        this.messages = res;
        return this.messages;
      }),
      catchError(this.handleError));
  }

  getMessage(id: number): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/message/${id}`; 
    return this.http.get(url).pipe(
      map((res: any) => {
        this.message = res;
        return res;
      }),
      catchError(this.handleError));
  }

  getMessageImage(id: number): Observable<Blob> {
    const url = `${GlobalConstants.apiURL}/message/image/${id}`; 
    return this.http.get(url, { responseType: 'blob' });
  }

  deleteMessage(id: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/message/${id}`; 
    return this.http.delete(url).pipe(
      map((res: any) => {
        return this.messages;
      }),
      catchError(this.handleError));
  }

  deleteFile(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/file/`;
    return this.http.delete(url).pipe(
      map((res: any) => {
        return this.messages;
      }),
      catchError(this.handleError));
  }

  uncrypt(id: number, values: any): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/message/uncrypt/${id}`;
    return this.http.post<Message>(url, values).pipe(
      map((res: any) => {
        this.text = res;
        return this.text;
      }),
      catchError(this.handleError));
  }

  sendMessage(message: Message, origin: any): Observable<Message[]> {
    const url = `${GlobalConstants.apiURL}/message`; 
    message.draft = false;
    message.sent_at = new Date().toISOString(); // Better practice for dates
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
    // Ensure we return an observable error for the pipe catchers
    return throwError(() => error);
  }
}