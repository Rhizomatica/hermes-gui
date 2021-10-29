import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.less']
})
export class LogComponent implements OnInit {

  uLog: boolean = false;
  eLog: boolean = false;
  dLog: boolean = false;

  edLog: boolean = false;
  currentUser: User;
  isAdmin = true;
  uucpLog: any;
  mailLog: any;
  uucpDebugLog: any;
  error = Error;

  constructor( private authenticationService: AuthenticationService, private apiService: ApiService){
    
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
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

  }


