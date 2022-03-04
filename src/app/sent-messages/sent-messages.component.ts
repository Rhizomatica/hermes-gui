import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';
import { UUCPQueue } from '../uucpqueue';
import { User } from '../user';
import { UserService } from '../_services/user.service';
import { MessageService } from '../_services/message.service';
import { UUCPService } from '../_services/uucp.service';
import { AlertService } from '../alert.service';
import { AuthenticationService } from '../_services/authentication.service';
import { Observable } from 'rxjs';
import { ApiService } from '../_services/api.service';


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
  noMessages = false;
  noUUcp = false;
  noQueue = false;
  transList = false;
  allowCompose = false;
  serverConfig: any;
  allowhmp: string;



  constructor(
    private messageService: MessageService,
    private uucpService: UUCPService,
    private apiService: ApiService,
    private alertService: AlertService,
    private authenticationService: AuthenticationService,
    // private userService: UserService
    )
    {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    

  closeError() {
      this.errorAlert = false;
  }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  cancelTransmission(host,id): void{
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

  cancelMail(host,id): void{
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

showTransmission() {
  if (this.transList == false) {
    this.transList = true;
  } else {
    this.transList = false;
  }

}

  removeMessage(message: Message): void{
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
    console.log('⚚ sent-messages component cancelTransmission:', message.id);
  }

confTransmit(){
  if (this.confirmTransmit === false) {
    this.confirmTransmit = true;
  } else {
    this.confirmTransmit = false;
  }
}

 transmitNow(): void{
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


  getMessages(): void{
    this.messageService.getMessagesByType('sent').subscribe(
      res => {
        this.sentMessages = res;
      },
      (err) => {
        this.error = err;
        this.noMessages = true;
      }
    );
  }

  getQueue(): void{
    this.uucpService.getQueue().subscribe(
      res => {
        this.queue = res;
         console.log('⚚ uucp queue:', this.queue);
         if (Object.keys(this.queue).length ==0) {
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
        for( let i = 0; i < this.queue.length; i++) {
          soma += parseInt(this.queue[i].size, 10);
          console.log(soma);
          return soma;
      }
    }
    }
  }

  getSysConfig(): void{
    this.apiService.getSysConfig().subscribe(
      (res: any) => {
        this.serverConfig= res;
        this.allowhmp = res.allowhmp;
        
        switch(this.allowhmp) {
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
    this.getMessages();
    this.getQueue();
    this.getQueueSize();
    this.getSysConfig();

    this.isadmin = this.currentUser.admin;
  }
}
