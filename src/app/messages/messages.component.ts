import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';import { MessageService } from '../_services/message.service';
import { AlertService } from '../alert.service';
// import { GlobalConstants } from '../global-constants';

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

  constructor(private messageService: MessageService, private alertService: AlertService) { }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  getInboxMessages(): void {
    this.messageService.getInboxMessages().subscribe(
      (res: any) => {
        this.messages = res;
        console.log("getinbox messages ret: ", res);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  getInboxMessage(message: Message): void {
      this.messageService.getInboxMessage(message.id).subscribe(
      (res: any) => {
        this.messages = res;
        console.log("getinbox messages ret: ", res);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  deleteInboxMessage(message: Message): void {
    this.messageService.getInboxMessage(message.id).subscribe(
      (res: any) => {
        this.messages = res;
        console.log("getinbox messages ret: ", res);
      },
      (err) => {
        this.error = err;
      }
    );
  }


  ngOnInit(): void {
    this.getInboxMessages();
  }
}
