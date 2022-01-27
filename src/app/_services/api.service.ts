import { Injectable, SystemJsNgModuleLoader } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../alert.service';
import { Observable, Scheduler, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
// import { Api } from '../api';
import { GlobalConstants } from '../global-constants';
import { Schedule } from '../schedule';


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
          console.log('⚚ Hermes ⚚\n⚚ api service - system config');
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }
    public sysShutdown() {
      const url = `${GlobalConstants.apiURL}/sys/shutdown`; // get api:sys/shutdown
      console.log('shutting down');
      this.http.get(url).subscribe();
    }

    public sysReboot() {
      const url = `${GlobalConstants.apiURL}/sys/reboot`; // get api:sys/reboot
      console.log('rebooting');
      this.http.get(url).subscribe();

    }

    public sysRestore(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/restore`; // get api:sys/restore
      // console.log(this.http.get(url));
      // console.log(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          // console.log('⚚ Hermes ⚚\n⚚ api service - system restore:\n ', res);
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
      return this.http.post(url, formData, {params, headers}).pipe(
      map((res: any) => {
        console.log('⚚ sys server setting - allowfile: ', res.allowfile);
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

    public getMailLog(): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/sys/maillog`; // get api:/sys/maillog
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res;
          // console.log('⚚ Hermes ⚚\n⚚ api service - mail log:\n ', res);
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
          // console.log('⚚ Hermes ⚚\n⚚ api service - uucp log:\n ', res);
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
          // console.log('⚚ Hermes ⚚\n⚚ api service - uucp debug log:\n ', res);
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }

    public getSchedules(): Observable<Schedule[]> {
      const url = `${GlobalConstants.apiURL}/caller`; // get api:/caller
      return this.http.get(url).pipe(
        map((res: any) => {
          this.schedules = res || [];
          console.log('⚚ Hermes ⚚\n⚚ api service - caller schedulles:\n ', res);
          return this.schedules;
      }),
      catchError(this.handleError));
    }


    public getSchedule(id: number): Observable<{}> {
      const url = `${GlobalConstants.apiURL}/caller/${id}`; // get api:/caller
      const output = this.http.get(url);
      return this.http.get(url).pipe(
        map((res: any) => {
          this.serverReturn = res || [];
          console.log('⚚ Hermes ⚚\n⚚ api service - caller schedule:\n ', res);
          return this.serverReturn;
      }),
      catchError(this.handleError));
    }


  public createSchedule(schedule: Schedule): Observable<Schedule[]> {
    const url = `${GlobalConstants.apiURL}/caller`; // POST /message
    schedule.id = 1;
    schedule.delay = "00:30:00";
    // messageImage: File;
    console.log('⚚ gateway scheduller - created');
    return this.http.post<Schedule>(url, schedule).pipe(
      map((res: any) => {
        this.schedule = res;
        return this.schedule;
    }),
     catchError(this.handleError),
    );
}


// need to verify this
public updateSchedule(schedule: Schedule) {
  const url = `${GlobalConstants.apiURL}/caller`; // POST /message
  console.log('⚚ gateway scheduller - updated');
  this.http.put<Schedule>(url, schedule).subscribe();
}

public deleteSchedule(id) {
  const url = `${GlobalConstants.apiURL}/caller/${id}`; // POST /message
  console.log('⚚ gateway scheduller - deleted');
  return this.http.delete(url).pipe(
    map((res: any) => {
      console.log('⚚ api service - deleteSchedule');
        return this.schedules;
    }),
   catchError(this.handleError));
}

    private handleError(error: HttpErrorResponse) {
      console.log('⚚ Hermes ⚚\n⚚ api service  error - :\n ', error);
	      return throwError(error);}
}

