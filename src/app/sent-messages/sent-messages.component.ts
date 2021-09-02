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

@Component({
  selector: 'app-sent-messages',
  templateUrl: './sent-messages.component.html',
  styleUrls: ['./sent-messages.component.less']
})
export class SentMessagesComponent implements OnInit {

  currentUser: User;
  error = '';
  success = '';
  test = '';
  messages: Message[];
  queue: UUCPQueue[];
  job: UUCPQueue;
  sentMessages: Message[];
  message: Message;
  selectedMessage: Message; //redundant?
  isadmin = false;
  searchMessages: string;
  confirmTransmit: boolean = false;

  constructor(
    private messageService: MessageService, 
    private uucpService: UUCPService, 
    private alertService: AlertService,
    private authenticationService: AuthenticationService,  
    // private userService: UserService
    ) 
    {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }


  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  cancelTransmission(host,id): void{
    //this.queue = this.sentMessages.filter(obj => obj !== job);
    //this.queue = this.sentMessages.filter(obj => obj !== job);
    this.uucpService.cancelTransmission(host, id).subscribe(
      (res: any) => {
        this.queue = res;
      },
      (err) => {
        this.error = err;
      }
    );
    console.log("⚚ sent-messages component cancelTransmission:", host, id);
  }

  removeMessage(message: Message): void{
    this.sentMessages = this.sentMessages.filter(obj => obj !== message);
    this.messageService.deleteMessage(message.id).subscribe(
      (res: any) => {
        this.message = res;

      },
      (err) => {
        this.error = err;
      }
    );
    console.log("⚚ sent-messages component cancelTransmission:", message.id);
  }

confTransmit(){
  if (this.confirmTransmit == false) {
    this.confirmTransmit = true; 
  } else {
    this.confirmTransmit = false;
  }
}

 transmitNow(): void{
    this.messageService.transmitNow().subscribe(
      (res: any) => {
        //this.message = res;

      },
      (err) => {
        this.error = err;
      }
    );
    console.log("⚚ sent-messages component transmit now:");
    
  }

  getMessages(): void{
    this.messageService.getMessages().subscribe(
      res => {
        this.sentMessages = res.filter(a => a.draft == false  && a.inbox == false);
         //console.log("⚚ sent-messages messages:", this.filteredMessages);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getQueue(): void{
    this.uucpService.getQueue().subscribe(
      res => {
        this.queue = res;
         console.log("⚚ uucp queue:", this.queue);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  ngOnInit(): void {
    this.getMessages();
    this.getQueue();
    this.isadmin = this.currentUser.admin;
  }
}