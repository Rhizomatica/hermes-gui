import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../_services/alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GlobalConstants } from '../global-constants';
import { interval } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RadioService {
  login = false;
  serverReturn: any;
  radioReturn: any;
  radioFrequency: any;
  radioMode: any;
  radioOffset: any;
  error = Error;

  constructor(
    private http: HttpClient,
    private alertService: AlertService
  ) { }



  public setRadioFreq(freq: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/freq/${freq}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioMode(mode: string): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/mode/${mode}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioBfo(bfo: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/bfo/${bfo}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioMastercal(mastercal: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/mastercal/${mastercal}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public getRadioStatus(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError));
  }

  public getRadioPower(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/power`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError));
  }

  public getRadioPttswr(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/power`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError));
  }

  public getRadioFrequency(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/freq`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError));
  }

  public getRadioMode(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/freq`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError));
  }

  public getRadioBfo(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/bfo`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError));
  }

  public getRadioRefThreshold(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/refthreshold`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError));
  }

  public setRadioRefThreshold(value: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/refthreshold/${value}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioRefThresholdv(value: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/refthresholdv/${value}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioPTT(value: string): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/ptt/${value}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioTone(value: string): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/tone/${value}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioBypass(value: string): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/bypass/${value}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public radioResetProtection(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/protection`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public radioSetDefaults(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/setdefaults`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public radioRestoreDefaults(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/restoredefaults`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioLed(value: string): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/led/${value}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public gpsStartCalibration(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/calibration`;
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
