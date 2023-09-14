import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { CustomErrorsService } from '../../../_services/custom-errors.service';
import { CustomError } from '../../../interfaces/customerror'
import { UtilsService } from 'src/app/_services/utils.service';

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
  errorAlert = false;
  loading = false
  customErrors: CustomError[]
  visibleArray: any = []
  searchError: string
  customLog: boolean
  system: any
  criticSpace = false;
  confirmDeleteAllLogs = false;


  constructor(private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private customErrorsService: CustomErrorsService,
    private utils: UtilsService
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
  }

  showEmailLog() {
    this.loading = true
    this.uLog = false;
    this.eLog = true;
    this.dLog = false;
    this.customLog = false;
    this.getLogMail();
  }

  showDebugLog() {
    this.loading = true
    this.uLog = false;
    this.eLog = false;
    this.dLog = true;
    this.customLog = false;
    this.getLogUucpDebug();
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
        this.customErrors = this.customErrors.filter((a) => { return a.created_at = this.utils.formatDate(a.created_at) });

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


  confirmDeleteAllCustomError() {
    this.confirmDeleteAllLogs = true
  }

  closedeleteconfirmation() {
    this.confirmDeleteAllLogs = false
  }

  deleteCustomError(id) {
    this.loading = true

    if (!id)
      this.deleteAllCustomError()

    if (id)
      this.deleteCustomErrorById(id)
  }

  deleteAllCustomError() {
    this.customErrorsService.deleteAllCustomError().subscribe(
      (data: any) => {
        this.showCustomLogs()
        this.loading = false
        this.confirmDeleteAllLogs = false
      },
      (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
        this.confirmDeleteAllLogs = false
      }
    );
  }

  deleteCustomErrorById(id) {
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

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res
        if (this.system.diskfree < 10485760) {
          this.criticSpace = true;
        }
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.loading = false
      }
    );
  }

  ngOnInit(): void {
    this.getSystemStatus()
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

  ngOnDestroy() {
  }

}


