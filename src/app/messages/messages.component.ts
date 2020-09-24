import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';
import { MESSAGES } from '../mock-messages';
import { MessageService } from '../message.service';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {

  @Input() message: Message;


  messages: Message[];

  selectedMessage: Message;

  ngOnInit(): void {
    this.getMessages();
  }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  getMessages(): void {
    this.messageService.getMessages().subscribe(messages => this.messages = messages);

  }
  constructor(private messageService: MessageService, private alertService: AlertService) { }
}
