import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';
import { Observable, throwError } from 'rxjs';
import { MessageService } from '../message.service';
import { AlertService } from '../alert.service';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {

  //@Input() message: Message;

  error = '';
  success = '';
  test = '';
  messages: Message[];
  message: Message;
  selectedMessage: Message;
  //this.GlobalConstants.teste = true

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
