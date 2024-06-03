import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})

export class GPSService {
  login = false;
  serverReturn: any;
  error = Error;
  files: string[];

  constructor(
    private http: HttpClient
  ) { }


  public getStoredGPSFiles(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/files`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    )
  }

  public getCurrentCoordinates(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/coordinates`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    )
  }

  public getGPSStatus(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/status`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    )
  }

  public getInterval(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/interval`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    )
  }

  public getFileRangeTime(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/filetime`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    )
  }

  public getEmail(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/email`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError)
    )
  }

  public updateGPSInterval(seconds): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/interval/${seconds}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public updateFileRangeTime(seconds): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/filetime/${seconds}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public updateGPSEmail(email): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/email/${email}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public toggleGPS(status): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/status/${status}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public deleteAllStoredFiles(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/delete`;
    return this.http.delete(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public SOSEmergency(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/sos`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

