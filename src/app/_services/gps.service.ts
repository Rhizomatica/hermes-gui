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
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError)
    )
  }

  public getCurrentCoordinates(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/coordinates`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError)
    )
  }

  public getStoredGPSFileByName(file): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/file/${file}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public updateGPSDelay(seconds): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/delay/${seconds}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }  

  public updateGPSFileDumpTime(seconds): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/dump/${seconds}`;
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
  
  
  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}

