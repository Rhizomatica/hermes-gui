import { Component, OnInit } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { MessageService } from '../../../_services/message.service';
import { ApiService } from '../../../_services/api.service';
import { UntypedFormGroup } from '@angular/forms';
import { GlobalConstants } from '../../../global-constants';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-message-config',
  templateUrl: './message-config.component.html',
  styleUrls: ['./message-config.component.less']
})

export class MessageConfigComponent implements OnInit {

  currentUser: User;
  error = Error;
  messages: Message[];
  message: Message;
  selectedMessages = false;
  allowfile: any;
  allowhmp: any;
  serverConfig: any;
  allowUp: UntypedFormGroup;
  errorAlert = false;
  noSystem = false;
  isAdmin = false;
  cleaned = false;
  loading = true

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
        this.loading = false
        return res;
      },
      (err) => {
        this.error = err;
        this.loading = false
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
    this.cleaned = true;
    this.messageService.deleteFile().subscribe(
      (res: any) => {
        this.messages = res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    )
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
    this.loading = true

    this.apiService.setFileConfig(value).subscribe(
      (res: any) => {
        this.allowfile = res.allowfile;
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  setComposePermission(value: string) {
    this.loading = true
    this.apiService.setMsgConfig(value).subscribe(
      (res: any) => {
        this.allowfile = res.allowfile;
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
    this.getMessages();
    this.getSysConfig();
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }
}
