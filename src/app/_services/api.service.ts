import { Injectable } from '@angular/core'; // SpyNgModuleFactoryLoader -> @angular/router
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../_services/alert.service';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { Api } from '../api';
import { GlobalConstants } from '../global-constants';
import { Schedule } from '../interfaces/schedule';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  login = false;
  serverReturn: any;
  error = Error;
  schedules: Schedule[];
  schedule: any[];

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
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }
    public sysShutdown() {
      const url = `${GlobalConstants.apiURL}/sys/shutdown`; // get api:sys/shutdown
      this.http.get(url).subscribe();
    }

    public sysReboot() {
      const url = `${GlobalConstants.apiURL}/sys/reboot`; // get api:sys/reboot
      this.http.get(url).subscribe();

    }

    //Nao existe rota na API
    public sysRestore(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/restore`; // get api:sys/restore
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    public setFileConfig(allowfile: string): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/config`;
      const formData: FormData = new FormData();
      formData.append('allowfile', allowfile);
      const params = new HttpParams();
      const headers = new HttpHeaders();
      headers.set('Content-Type', null);
      headers.set('Accept', 'multipart/form-data');
      // Authorization: 'my-auth-token'
      return this.http.post(url, formData, {params, headers}).pipe(
      map((res: any) => {
        return res.allowfile;
      }),
      catchError(this.handleError)
      );
  }

  public setMsgConfig(allowhmp: string): Observable<{}> {
    const url = `${GlobalConstants.apiURL}/sys/config`;
    const formData: FormData = new FormData();
    formData.append('allowhmp', allowhmp);
    const params = new HttpParams();
    const headers = new HttpHeaders();
    headers.set('Content-Type', null);
    headers.set('Accept', 'multipart/form-data');
    // Authorization: 'my-auth-token'
    return this.http.post(url, formData, {params, headers}).pipe(
    map((res: any) => {
      return res.allowhmp;
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

    public getMailLog(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/maillog`; // get api:/sys/maillog
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    public getUucpLog(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/uulog`; // get api:/sys/uulog
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    public getUucpDebugLog(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/uudebug`; // get api:/sys/uulog
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    public getSchedules(): Observable<Schedule[]> {
      const url = `${GlobalConstants.apiURL}/caller`; // get api:/caller
      return this.http.get(url).pipe(
        map((res: any) => {
          this.schedules = res || [];
          return this.schedules;
      }),
      catchError(this.handleError));
    }


    public getSchedule(id: number): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/caller/${id}`; // get api:/caller
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }


  public createSchedule(schedule: Schedule): Observable<Schedule[]> {
    const url = `${GlobalConstants.apiURL}/caller`; // POST /message
    return this.http.post<Schedule>(url, schedule).pipe(
      map((res: any) => {
        this.schedule = res;
        return this.schedule;
    }),
     catchError(this.handleError),
    );
}


// need to verify this
public updateSchedule(id: number, schedule: Schedule): Observable<Schedule>{
  const url = `${GlobalConstants.apiURL}/caller/${id}`; // POST /message
  return this.http.put<Schedule>(url, schedule).pipe(
   catchError(this.handleError),
  );
}


public deleteSchedule(id) {
  const url = `${GlobalConstants.apiURL}/caller/${id}`; // POST /message
  return this.http.delete(url).pipe(
    map((res: any) => {
        return this.schedules;
    }),
   catchError(this.handleError));
}

    private handleError(error: HttpErrorResponse) {
	      return throwError(error);}
}

