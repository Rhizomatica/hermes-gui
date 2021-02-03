import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';import { MessageService } from '../_services/message.service';
import { AlertService } from '../alert.service';
// import { GlobalConstants } from '../global-constants';

export interface MessageInbox {
  id: number;
  name: string;
  orig: string;
  dest: string;
  text: string;
  file: string;
  draft: boolean;
  //crypt: boolean;
  sent_at: string;

}
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {

//  @Input() message: Message;

  error = '';
  success = '';
  test = '';
  messages: Message[];
  message: Message;
  selectedMessage: Message;
  isAdmin: boolean = true;
  inboxMessages: any[];

  constructor(private messageService: MessageService, private alertService: AlertService) { }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  getInboxMessages(): void {
    this.messageService.getInboxMessages().subscribe(
      (res: any) => {
        this.messages = res;
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
        console.log("getinbox message ret: ", res);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  deleteInboxMessage($id): void {
    console.log("debug delete", $id);
    this.messageService.getInboxMessage($id).subscribe(
      (res: any) => {
        this.messages = res;
        console.log("delete inbox message ret: ", res);
      },
      (err) => {
        this.error = err;
        console.error (err);
      }
    );
  }


  ngOnInit(): void {
    this.getInboxMessages();
  }
}
