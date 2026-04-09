import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomError } from '../interfaces/customerror';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})

export class CustomErrorsService {

  constructor(
    private http: HttpClient) {

  }

  customError!: CustomError;
  text: string = '';

  httpOptions = {
    headers: new HttpHeaders({
      Authorization: 'my-auth-token',
      'Content-Disposition': 'multipart/form-data',
    })
  };

  getCustomErrors(): Observable<CustomError[]> {
    const url = `${GlobalConstants.apiURL}/customerrors`;
    return this.http.get<CustomError[]>(url).pipe(
      map((res: CustomError[]) => {
        return res;
      }),
      catchError(this.handleError));
  }

  deleteCustomError(id: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/customerrors/${id}`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError));
  }

  deleteAllCustomError(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/customerrors`;
    return this.http.delete(url)
      .pipe(
        catchError(this.handleError));
  }

  newCustomError(erro: CustomError): Observable<CustomError> {
    const url = `${GlobalConstants.apiURL}/customerrors`;
    return this.http.post<CustomError>(url, erro).pipe(
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    this.customError = {} as CustomError;
    return throwError(error);
  }

}