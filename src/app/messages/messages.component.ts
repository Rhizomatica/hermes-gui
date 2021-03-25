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
  error = '';
  success = '';
  test = '';
  inboxMessages: Message[];
  message: Message;
  selectedMessage: Message;
  isadmin = false;
  

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
    this.messageService.getMessages().subscribe(
      (res: any) => {
        //this.messages = res;
        this.inboxMessages = res.filter(a => a.inbox == true);
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
      }
    );
  }


  
  deleteInboxMessage($id): void {
    console.log('⚚ messages - delete id: ', $id);
    this.messageService.deleteInboxMessage($id).subscribe(
      (res: any) => {
        this.message = res;
        console.log('⚚ messages - deleteInboxMessage -  res: ', res);
      },
      (err) => {
        this.error = err;
        // console.error (err);
      }
    );
  }


  ngOnInit(): void {
    this.getInboxMessages();
    this.isadmin = this.currentUser.admin;
    //console.log(this.isadmin);
  }
}
