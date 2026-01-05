import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GlobalConstants } from '../global-constants';

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
    private http: HttpClient) { }

  public setRadioFreq(freq: number, radioProfile: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/freq/${freq}/${radioProfile}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioMode(mode: string, radioProfile: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/mode/${mode}/${radioProfile}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public getRadioStatus(profile: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/${profile}`;
    const output = this.http.get(url);
    return this.http.get(url).pipe(
      map((res: any) => {
        this.serverReturn = res;
        return this.serverReturn;
      }),
      catchError(this.handleError));
  }

  public setRadioRefThreshold(value: number, radioProfile: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/refthreshold/${value}/${radioProfile}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioPTT(value: string, radioProfile): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/ptt/${value}/${radioProfile}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioTone(value: string, radioProfile: number): Observable<{}> {

    var route = '/radio/tone/' + value

    if (GlobalConstants.bitx == 'S') {
      route = '/radio/tone/sbitx/' + value + '/' + radioProfile
    }

    const url = `${GlobalConstants.apiURL}${route}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public radioResetProtection(radioProfile: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/protection/${radioProfile}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public radioRestoreDefaults(radioProfile: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/default/${radioProfile}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public gpsStartCalibration(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/geolocation/calibration`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public getStep(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/step/`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public updateStep(step: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/step/${step}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public changeVolume(volume: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/volume/${volume}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public eraseSDCard(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/erasesdcard/`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public changeOperateModeProfile(profile: number): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/profile/${profile}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public restartVoiceTimeout(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/voice/timeout`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public getTimeoutConfig(): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/voice/timeout/config`;
    return this.http.get(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setTimeoutConfig(time): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/radio/voice/timeout/config/${time}`;
    return this.http.post(url, null).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public getRadioPowerLevel(profile: number): Observable<{ number }> {
    const url = `${GlobalConstants.apiURL}/radio/powerlevel/${profile}`;
    return this.http.get<number>(url).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public setRadioPowerLevel(powerLevelObject): Observable<{ number }> {
    const url = `${GlobalConstants.apiURL}/radio/powerlevel/`;
    return this.http.post<number>(url, powerLevelObject).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  public toggleDigital(digital): Observable<{ number }> {
    const url = `${GlobalConstants.apiURL}/radio/voice/digital`;
    return this.http.post<number>(url, digital).pipe(
      map((res: any) => {
        return res;
      }),
      catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
