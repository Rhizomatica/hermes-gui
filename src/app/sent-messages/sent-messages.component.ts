import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';
import { User } from '../user';
import { UserService } from '../_services/user.service';
import { MessageService } from '../_services/message.service';
import { AlertService } from '../alert.service';
import { AuthenticationService } from '../_services/authentication.service';

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
  draftMessages: Message[];
  sentMessages: Message[];
  message: Message;
  selectedMessage: Message;
  isadmin = false;

  constructor(
    private messageService: MessageService, 
    private alertService: AlertService,
    private authenticationService: AuthenticationService,  
    private userService: UserService
    ) 
    {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  cancelTransmission(message: Message): void {
    this.messageService.deleteMessage(message.id).subscribe(
      (res: any) => {
        this.message = res;
      },
      (err) => {
        this.error = err;
      }
    );
    console.log("⚚ sent-messages component cancelTransmission:", message.id);
    this.getMessages();
    //setTimeout(function(){ window.location.reload(); }, 500);
    
  }

  getMessages(): void {
    this.messageService.getMessages().subscribe(
      (res: any) => {
        this.draftMessages = res.filter(a => a.draft == true && a.inbox == false);
        this.sentMessages = res.filter(a => a.draft == false  && a.inbox == false);
         //console.log("⚚ sent-messages messages:", this.filteredMessages);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  

  ngOnInit(): void {
    this.getMessages();
    this.isadmin = this.currentUser.admin;

  }

}





