import { Component, OnInit } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { UUCPQueue } from '../../../interfaces/uucpqueue';
import { User } from '../../../interfaces/user';
import { MessageService } from '../../../_services/message.service';
import { UUCPService } from '../../../_services/uucp.service';
import { AlertService } from '../../../_services/alert.service';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'app-transmission-list',
  templateUrl: './transmission-list.component.html',
  styleUrls: ['./transmission-list.component.less']
})

export class TransmissionListComponent implements OnInit {

  currentUser: User;
  error = Error;
  messages: Message[];
  queue: UUCPQueue[];
  job: UUCPQueue;
  sentMessages: Message[];
  message: Message;
  // selectedMessage: Message; // redundant?
  isadmin = false;
  searchMessages: string;
  confirmTransmit = false;
  errorAlert = false;
  noMessages = false;
  noUUcp = false;
  noQueue = false;
  transList = false;
  loading = true;
  jobToForce: UUCPQueue

  constructor(
    private messageService: MessageService,
    private uucpService: UUCPService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  closeError() {
    this.errorAlert = false;
  }

  // onSelect(message: Message): void {
  //   this.selectedMessage = message;
  // }

  cancelTransmission(host, id): void {
    this.uucpService.cancelTransmission(host, id).subscribe(
      (res: any) => {
        this.queue = this.queue.filter(obj => obj.uuiduucp !== id);
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
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
  }

  showTransmission() {
    if (this.transList == false) {
      this.transList = true;
    } else {
      this.transList = false;
    }
  }

  removeMessage(message: Message): void {
    this.sentMessages = this.sentMessages.filter(obj => obj !== message);
    this.messageService.deleteMessage(message.id).subscribe(
      (res: any) => {
        this.message = res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  confTransmit(job: UUCPQueue) {
    if (this.confirmTransmit === false) {
      this.confirmTransmit = true;
      this.jobToForce = job;
    } else {
      this.confirmTransmit = false;
    }
  }

  transmitNow(): void {
    this.uucpService.callSystem(this.jobToForce.uuidhost).subscribe(
      (res: any) => {
        this.confirmTransmit = false;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.confirmTransmit = false;
      }
    );
  }

  getMessages(): void {
    this.messageService.getMessagesByType('sent').subscribe(
      res => {
        this.sentMessages = res;
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.noMessages = true;
        this.loading = false
      }
    );
  }

  closeOveralTransmission(){
    this.confirmTransmit = false
  }

  getQueue(): void {
    this.uucpService.getQueue().subscribe(
      res => {
        this.queue = res;
        if (Object.keys(this.queue).length == 0) {
          this.noQueue = true;
          this.queue = null
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
      if (this.queue.length === 0) {
        let soma = 0;
        for (let i = 0; i < Object.keys(this.queue).length; i++) {
          soma += parseInt(this.queue[i].size);
        }
        return soma;
      }
    }
  }

  ngOnInit(): void {
    this.getMessages();
    this.getQueue();
    this.getQueueSize();
    this.isadmin = this.currentUser.admin;
  }
}
