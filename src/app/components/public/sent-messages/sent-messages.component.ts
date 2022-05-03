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
  test = '';
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
    this.uucpService.cancelTransmission(host, id).subscribe(
      (res: any) => {
        this.queue = this.queue.filter(obj => obj.uuiduucp !== id);
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
    console.log('⚚ cancelTransmission:', host, id);
  }

  cancelMail(host, id): void {
    this.uucpService.cancelMail(host, id).subscribe(
      (res: any) => {
        this.queue = this.queue.filter(obj => obj.uuiduucp !== id);
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
    console.log('⚚ cancelMail:', host, id);
  }

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
    let msgId = 0;
    msgId = this.selectedMessage.id;
    console.log(msgId);
    console.log(this.selectedMessage);
    this.messageService.deleteMessage(msgId).subscribe(
      (res: any) => {
        this.message = res;
        this.getSentMessages();
        this.deleteMessage = false;
      },
      (err) => {
        this.error = err;
        this.deleteMessage = false;
      }
    );
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
        // this.message = res;
        console.log('⚚ sent-messages component transmit now:');
        this.confirmTransmit = false;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        console.log('⚚ sent-messages component transmit now fail:');
      }
    );
  }

  getSentMessages(): void {
    this.messageService.getMessagesByType('sent').subscribe(
      res => {
        this.sentMessages = res;
        this.noMessages = false;
      },
      (err) => {
        this.error = err;
        this.noMessages = true;
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
      }
    );
  }

  getQueueSize() {
    if (this.queue) {
      if (this.queue !== []) {
        let soma = 0;
        for (let i = 0; i < this.queue.length; i++) {
          soma += parseInt(this.queue[i].size, 10);
          console.log(soma);
          return soma;
        }
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
    this.isadmin = this.currentUser.admin;
  }
}
