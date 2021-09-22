import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { Api } from '../api';
import { GlobalConstants } from '../global-constants';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
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


    public getStatus(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/status`; // get api:sys/status
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          console.log('⚚ Hermes ⚚\n⚚ api service - system status:\n ', res);
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    public getSysConfig(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/config`; // get api:sys/status
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          console.log('⚚ Hermes ⚚\n⚚ api service - system config:\n ', res);
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }
    public sysShutdown(): void {
      const url = `${GlobalConstants.apiURL}/sys/shutdown`; // get api:sys/status
      console.log('shutting down');
      this.http.get(url);
    }

    public sysReboot(): void {
      const url = `${GlobalConstants.apiURL}/sys/reboot`; // get api:sys/status
      console.log('rebooting');
      this.http.get(url);
    }

    public sysRestore(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/restore`; // get api:sys/restore
      //console.log(this.http.get(url));
      console.log(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          console.log('⚚ Hermes ⚚\n⚚ api service - system restore:\n ', res);
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    public setSysConfig(allowfile: string): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/config`; 

      const formData: FormData = new FormData();

      formData.append('allowfile', allowfile);

      const params = new HttpParams();
      const headers = new HttpHeaders();
      headers.set('Content-Type', null);
      headers.set('Accept', 'multipart/form-data');
      // Authorization: 'my-auth-token'

    return this.http.post(url, formData, {params, headers})
    .pipe(
      map((res: any) => {
        console.log('⚚ sys server setting - allowfile: ',res.allowfile);
        return res.allowfile;
      }),
      catchError(this.handleError)
      );
  }

    public getLogin(plogin, ppassword): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/login`; // get api:sys/status
      const data =  {login: plogin, password: ppassword};
      return this.http.post(url, data[0]).pipe(
        map((res: any) => {
          this.serverReturn = res;
          return this.serverReturn;
        }),
        catchError(this.handleError)
        );
    }

    public setRadioFreq (freq: number): Observable<{}> {
      var url = `${GlobalConstants.apiURL}/radio/freq/${freq}`; 
      return this.http.post(url,null).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
    }

    public setRadioMode (mode: string): Observable<{}> {
      var url = `${GlobalConstants.apiURL}/radio/mode/${mode}`; 
      return this.http.post(url,null).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
    }

    public setRadioBfo (bfo: number): Observable<{}> {
      var url = `${GlobalConstants.apiURL}/radio/bfo/${bfo}`; 
      return this.http.post(url,null).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
    }

    public setRadioMastercal(mastercal: number): Observable<{}> {
      var url = `${GlobalConstants.apiURL}/radio/mastercal/${mastercal}`; 
      return this.http.post(url,null).pipe(
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
          this.serverReturn= res;
          console.log('⚚ Hermes ⚚\n⚚ api service - radio status:\n ', res);
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
          console.log('⚚ Hermes ⚚\n⚚ api service - radio status:\n ', res);
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
          console.log('⚚ Hermes ⚚\n⚚ api service - radio status:\n ', res);
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
          console.log('⚚ Hermes ⚚\n⚚ api service - radio status:\n ', res);
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
          console.log('⚚ Hermes ⚚\n⚚ api service - radio ref threshol:\n ', res);
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    public setRadioRefThreshold(value: number): Observable<{}> {
      var url = `${GlobalConstants.apiURL}/radio/refthreshold/${value}`; 
      return this.http.post(url,null).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
    }

    public setRadioPTT(value: string): Observable<{}> {
      var url = `${GlobalConstants.apiURL}/radio/ptt/${value}`; 
      return this.http.post(url,null).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
    }

    public setRadioTone(value: string): Observable<{}> {
      var url = `${GlobalConstants.apiURL}/radio/tone/${value}`; 
      return this.http.post(url,null).pipe(
        map((res: any) => {
          return res;
        }),
        catchError(this.handleError));
    }

    public radioReset(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/radio/reset`; 
      const output = this.http.get(url);
      return this.http.post(url,null).pipe(
        map((res: any) => {
          this.serverReturn = res;
          console.log('⚚ Hermes ⚚\n⚚ api service - radio reset:\n ', res);
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }
	

    private handleError(error: HttpErrorResponse) {
      console.log('⚚ Hermes ⚚\n⚚ api service  error - :\n ', error);
	  return throwError(error);
    }
}
