import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';import { MessageService } from '../message.service';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-sent-messages',
  templateUrl: './sent-messages.component.html',
  styleUrls: ['./sent-messages.component.less']
})
export class SentMessagesComponent implements OnInit {

  error = '';
  success = '';
  test = '';
  messages: Message[];
   message: Message;
  selectedMessage: Message;

  constructor(private messageService: MessageService, private alertService: AlertService) { }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  getMessages(): void {
    this.messageService.getMessages().subscribe(
      (res: any) => {
        this.messages = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  ngOnInit(): void {
    this.getMessages();
  }

}




