import { Component, OnInit } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { MessageService } from '../../../_services/message.service';
import { ApiService } from '../../../_services/api.service';
import { FormGroup } from '@angular/forms';
import { GlobalConstants } from '../../../global-constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-messageadm',
  templateUrl: './messageadm.component.html',
  styleUrls: ['./messageadm.component.less']
})

export class MessageadmComponent implements OnInit {

  currentUser: User;
  error = Error;
  messages: Message[];
  message: Message;
  selectedMessages = false;
  allowfile: any;
  allowhmp: any;
  serverConfig: any;
  allowUp: FormGroup;
  errorAlert = false;
  noSystem = false;
  isAdmin = false;
  cleaned = false;

  constructor(
    private messageService: MessageService,
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private http: HttpClient
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSysConfig(): void {
    this.apiService.getSysConfig().subscribe(
      (res: any) => {
        this.serverConfig = res;
        this.allowfile = res.allowfile;
        this.allowhmp = res.allowhmp;
        return res;
      },
      (err) => {
        this.error = err;
        this.noSystem = true;
        this.errorAlert = true;
      }
    );
  }

  closeError() {
    this.errorAlert = false;
  }

  loggedin() {
    if (this.isAdmin) {
      this.isAdmin = false;
    } else {
      this.isAdmin = true;
    }
  }

  confirmDelete() {
    if (this.selectedMessages) {
      this.selectedMessages = false;
    } else {
      this.selectedMessages = true;
    }
  }

  cleanUp() {
    const url = `${GlobalConstants.apiURL}/api/file`;
    this.cleaned = true;
    return this.http.delete(url); //TODO - Move to service...
  }

  getMessages(): void {
    this.messageService.getMessagesByType('inbox').subscribe(
      (res: any) => {
        this.messages = res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  setUploadPermission(value: string) {
    this.apiService.setFileConfig(value).subscribe(
      (res: any) => {
        this.allowfile = res.allowfile;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  setComposePermission(value: string) {
    this.apiService.setMsgConfig(value).subscribe(
      (res: any) => {
        this.allowfile = res.allowfile;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  ngOnInit(): void {
    this.getMessages();
    this.getSysConfig();
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }
}
