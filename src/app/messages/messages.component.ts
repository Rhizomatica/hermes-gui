import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';
import { MessageService } from '../_services/message.service';
import { AlertService } from '../alert.service';
import { User } from '../user';
//import { GlobalConstants } from '../global-constants';
import { UserService } from '../_services/user.service';
import { AuthenticationService } from '../_services/authentication.service';


export interface MessageInbox {
  id: number;
  searchMessages: string;
  name: string;
  orig: string;
  dest: string;
  text: string;
  file: string;
  draft: boolean;
  // crypt: boolean;
  sent_at: string;

}
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {

// @Input() message: Message;
  currentUser: User;
  error = Error;
  success = '';
  test = '';
  inboxMessages: Message[];
  message: Message;
  selectedMessage: Message;
  isadmin = false;
  searchMessages: string;
  today = Date();
  noMessages = false;


  constructor(private messageService: MessageService,  private alertService: AlertService, 
    private authenticationService: AuthenticationService, private userService: UserService
    ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('read message: id=$' + message.id);
  }

  getInboxMessages(): void {
    this.messageService.getMessagesByType('inbox').subscribe(
      (res: any) => {
        this.inboxMessages = res;
     },
      (err) => {
        this.error = err;
      }
    );
  }

  getInboxMessage($id): void {
      this.messageService.getInboxMessage($id).subscribe(
      (res: any) => {
        this.message = res;
      },
      (err) => {
        this.error = err;
        this.noMessages = true;
      }
    );
  }
  
  deleteInboxMessage($id): void {
    console.log('⚚ messages - delete id: ', $id);
    this.inboxMessages= this.inboxMessages.filter(obj => obj !== this.message);

    this.messageService.deleteMessage($id).subscribe(
      (res: any) => {
        this.message = res;
        console.log('⚚ messages - deleteInboxMessage -  res: ', res);
        this.getInboxMessages();
      },
      (err) => {
        this.error = err;
        // console.error (err);
      }
    );
  }


  ngOnInit(): void {
    this.getInboxMessages();
    if(this.currentUser) {
    this.isadmin = this.currentUser.admin;

    } else {
     this.isadmin = false; 
    }
    //console.log(this.isadmin);
  }
}
