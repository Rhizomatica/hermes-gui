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
  public intervallTimer = interval(10000);
  private subscription1;
  private subscription2;
  private subscription3;
  errorAlert = false;
  loading = false

  constructor(private authenticationService: AuthenticationService, private apiService: ApiService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  showUucpLog() {
    this.loading = true
    this.uLog = true;
    this.eLog = false;
    this.dLog = false;
    this.getLogUucp();
    this.subscription1 = this.intervallTimer.subscribe(() => this.getLogUucp());
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    };
    if (this.subscription3) {
      this.subscription3.unsubscribe();
    }
  }

  showEmailLog() {
    this.loading = true
    this.uLog = false;
    this.eLog = true;
    this.dLog = false;
    this.getLogMail();
    this.subscription2 = this.intervallTimer.subscribe(() => this.getLogMail());
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    };
    if (this.subscription3) {
      this.subscription3.unsubscribe();
    }
  }

  showDebugLog() {
    this.loading = true
    this.uLog = false;
    this.eLog = false;
    this.dLog = true;
    this.getLogUucpDebug();
    this.subscription3 = this.intervallTimer.subscribe(() => this.getLogUucpDebug());
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    };
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }


  getLogUucp() {
    this.apiService.getUucpLog().subscribe(
      (res: any) => {
        this.uucpLog = res;
        this.loading = false
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  getLogMail() {
    this.apiService.getMailLog().subscribe(
      (res: any) => {
        this.mailLog = res;
        this.loading = false
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  getLogUucpDebug() {
    this.apiService.getUucpDebugLog().subscribe(
      (res: any) => {
        this.uucpDebugLog = res;
        this.loading = false
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  closeLogs() {
    this.uLog = false;
    this.eLog = false;
    this.dLog = false;
  }

  closeError() {
    this.errorAlert = false;
  }

  ngOnInit(): void {
    // this.getLogUucp();
    // this.getLogMail();
    // this.getLogUucpDebug();

    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

  ngOnDestroy() {
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    };
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
    if (this.subscription3) {
      this.subscription3.unsubscribe();
    }
  }

}


