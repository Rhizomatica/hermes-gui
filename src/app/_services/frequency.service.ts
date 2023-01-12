import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
// import { AlertService } from './alert.service';
import { Observable, throwError, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Frequency } from '../interfaces/frequency';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class FrequencyService {

  constructor(
    private http: HttpClient
    // private alertService: AlertService
  ) { }

  frequencies: Frequency[];
  frequency: any[];
  text: string;

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token',
      'Content-Disposition': 'multipart/form-data',
    })
  };

  getFrequencies(): Observable<Frequency[]> {
    const url = `${GlobalConstants.apiURL}/frequency`;
    return this.http.get(url).pipe(
      map((res: any) => {
        this.frequencies = res;
        return this.frequencies;
      }),
      catchError(this.handleError));
  }

  getFrequency(id: number): Observable<Frequency[]> {
    const url = `${GlobalConstants.apiURL}/frequency/${id}`;
    return this.http.get(url).pipe(
      map((res: any) => {
        this.frequency = res;
        return res;
      }),
      catchError(this.handleError));
  }

  updateFrequency(id: number, frequency: Frequency): Observable<Frequency> {
    const url = `${GlobalConstants.apiURL}/frequency/${id}`;
    return this.http.put<Frequency>(url, frequency).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    this.frequency = [];
    return throwError(error);
  }

}