import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { interval } from 'rxjs';


export interface LogList {
  line: string;
  content: string;
}

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.less']
})
export class LogComponent implements OnInit, OnDestroy {

  uLog = false;
  eLog = false;
  dLog = false;
  edLog = false;
  currentUser: User;
  isAdmin = true;
  uucpLog: any;
  mailLog: any;
  uucpDebugLog: any;
  error = Error;
  log: LogList;
  public intervallTimer = interval(50000);
  private subscription1;
  private subscription2;
  private subscription3;

  constructor( private authenticationService: AuthenticationService, private apiService: ApiService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  showUucpLog() {
    this.uLog = true;
    this.eLog = false;
    this.dLog = false;
  }

  showEmailLog() {
    this.uLog = false;
    this.eLog = true;
    this.dLog = false;
  }

  showDebugLog() {
    this.uLog = false;
    this.eLog = false;
    this.dLog = true;
  }


  getLogUucp() {
    this.apiService.getUucpLog().subscribe(
      (res: any) => {
        this.uucpLog = res;
        // console.log('read');

        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getLogMail() {
    this.apiService.getMailLog().subscribe(
      (res: any) => {
        this.mailLog = res;
        // console.log(this.mailLog);
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getLogUucpDebug() {
    this.apiService.getUucpDebugLog().subscribe(
      (res: any) => {
        this.uucpDebugLog = res;
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  closeLogs() {
    this.uLog = false;
    this.eLog = false;
  }




  ngOnInit(): void {
    this.getLogUucp();
    this.getLogMail();
    this.getLogUucpDebug();
    this.subscription1 = this.intervallTimer.subscribe(() => this.getLogUucp());
    this.subscription2 = this.intervallTimer.subscribe(() => this.getLogMail());
    this.subscription3 = this.intervallTimer.subscribe(() => this.getLogUucpDebug());

    this.getLogUucp();
    this.getLogMail();
    this.getLogUucpDebug();
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

  ngOnDestroy() { 

    this.subscription1.unsubscribe();
    this.subscription2.unsubscribe();
    this.subscription3.unsubscribe();
    console.log('quiting radio config');
  }

  }


