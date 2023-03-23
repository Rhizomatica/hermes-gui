import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { UUCPQueue } from '../../../interfaces/uucpqueue';
import { User } from '../../../interfaces/user';
import { MessageService } from '../../../_services/message.service';
import { UUCPService } from '../../../_services/uucp.service';
import { AlertService } from '../../../_services/alert.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-sent-messages',
  templateUrl: './sent-messages.component.html',
  styleUrls: ['./sent-messages.component.less']
})


export class SentMessagesComponent implements OnInit {

  currentUser: User;
  error = Error;
  success = '';
  messages: Message[];
  queue: UUCPQueue[];
  job: UUCPQueue;
  sentMessages: Message[];
  message: Message;
  selectedMessage: Message; // redundant?
  isadmin = false;
  searchMessages: string;
  confirmTransmit = false;
  errorAlert = false;
  noMessages = true;
  noUUcp = false;
  noQueue = false;
  allowCompose = false;
  serverConfig: any;
  allowhmp: string;
  deleteMessage = false;
  loading = true

  constructor(
    private messageService: MessageService,
    private uucpService: UUCPService,
    private apiService: ApiService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  closeError() {
    this.errorAlert = false;
  }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  cancelTransmission(host, id): void {
    this.uucpService.cancelTransmision(host, id).subscribe(
      (res: any) => {
        this.queue = this.queue.filter(obj => obj.uuiduucp !== id);
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  // cancelMail(host, id, language): void {
  //   this.uucpService.cancelMail(host, id, language).subscribe(
  //     (res: any) => {
  //       this.queue = this.queue.filter(obj => obj.uuiduucp !== id);
  //     }, (err) => {
  //       this.error = err;
  //       this.errorAlert = true;
  //     }
  //   );
  // }

  showDelete() {
    if (this.deleteMessage) {
      this.deleteMessage = false;
    } else {
      this.deleteMessage = true;
    }
  }

  selectMessage(message: Message): void {
    this.selectedMessage = message;
  }

  deleteThisMessage() {
    this.loading = true
    let msgId = 0;
    msgId = this.selectedMessage.id;
    this.messageService.deleteMessage(msgId).subscribe(
      (res: any) => {
        this.message = res;
        this.getSentMessages();
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
    this.deleteMessage = false;
  }

  confTransmit() {
    if (this.confirmTransmit === false) {
      this.confirmTransmit = true;
    } else {
      this.confirmTransmit = false;
    }
  }

  transmitNow(): void {
    this.uucpService.callSystems().subscribe(
      (res: any) => {
        this.confirmTransmit = false;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  getSentMessages(): void {
    this.loading = true
    this.messageService.getMessagesByType('sent').subscribe(
      res => {
        this.sentMessages = res.sort((a, b) => { return new Date(a.sent_at) < new Date(b.sent_at) ? 1 : -1; });
        this.noMessages = false;
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.noMessages = true;
        this.loading = false
      }
    );
  }

  getQueue(): void {
    this.uucpService.getQueue().subscribe(
      res => {
        this.queue = res;
        if (Object.keys(this.queue).length == 0) {
          this.noQueue = true;
        } else {
          this.noQueue = false;
        }
      },
      (err) => {
        this.error = err;
        this.noUUcp = true;
        this.errorAlert = true;
      }
    );
  }

  getQueueSize() {
    if (this.queue) { 
        let soma = 0;
        for (let i = 0; i < this.queue.length; i++) {
          soma += parseInt(this.queue[i].size, 10);
          return soma;
        }
    }
  }

  getSysConfig(): void {
    this.apiService.getSysConfig().subscribe(
      (res: any) => {
        this.serverConfig = res;
        this.allowhmp = res.allowhmp;

        switch (this.allowhmp) {
          case 'users':
            if (this.currentUser) {
              this.allowCompose = true;
            }
            break;
          case 'admin':
            if (this.currentUser) {
              if (this.isadmin) {
                this.allowCompose = true;
              }
            }
            break;
          case 'all':
            this.allowCompose = true;
            break;
          default:
            this.allowCompose = false;
        }
        return res;
      },
      (err) => {
        this.error = err;
        this.allowCompose = false;
      }
    );
  }

  ngOnInit(): void {
    this.getSentMessages();
    this.getSysConfig();
    if(this.currentUser)
      this.isadmin = this.currentUser.admin;
  }
}
