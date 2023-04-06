import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { interval } from 'rxjs';
import { CustomErrorsService } from '../../../_services/custom-errors.service';
import { CustomError } from '../../../interfaces/customerror'

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
  public intervallTimer = interval(10000); //TODO - Remove timer (switch to reload button)
  private subscription1;
  private subscription2;
  private subscription3;
  errorAlert = false;
  loading = false

  customErrors: CustomError[]
  visibleArray: any = []
  searchError: String
  customLog: boolean

  constructor(private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private customErrorsService: CustomErrorsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  showUucpLog() {
    this.loading = true
    this.uLog = true;
    this.eLog = false;
    this.dLog = false;
    this.customLog = false;
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
    this.customLog = false;
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
    this.customLog = false;
    this.getLogUucpDebug();
    this.subscription3 = this.intervallTimer.subscribe(() => this.getLogUucpDebug());
    if (this.subscription1) {
      this.subscription1.unsubscribe();
    };
    if (this.subscription2) {
      this.subscription2.unsubscribe();
    }
  }

  showCustomLogs() {
    this.loading = true
    this.uLog = false;
    this.eLog = false;
    this.dLog = false;
    this.customLog = true;
    this.getCustomErrors();
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

  getCustomErrors() {
    this.loading = true
    this.customErrorsService.getCustomErrors().subscribe(
      (data: any) => {
        this.customErrors = data.sort((a, b) => { return new Date(a.created_at) < new Date(b.created_at) ? 1 : -1; });
        this.loading = false;
        this.loadVisibleArray(data)
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
      }
    );
  }

  loadVisibleArray(data) {
    this.visibleArray = []
    data.forEach(item => {
      this.visibleArray.push(false)
    });
  }

  viewLog(i) {
    for (let index = 0; index < this.visibleArray.length; index++) {
      this.visibleArray[index] = false
    }

    this.visibleArray[i] = true
  }

  deleteCustomError(id){
    this.loading = true
    this.customErrorsService.deleteCustomError(id).subscribe(
      (data: any) => {
        this.showCustomLogs()
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
      }
    );
  }

  ngOnInit(): void {
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


