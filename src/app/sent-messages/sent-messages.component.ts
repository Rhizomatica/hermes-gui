import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../message';
import { MessageService } from '../_services/message.service';
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
  filteredMessages: Message[];
  draftMessages: Message[];
  sentMessages: Message[];
  message: Message;
  selectedMessage: Message;
  isAdmin = true;

  constructor(private messageService: MessageService, private alertService: AlertService) { }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('mensagem lida: id=$' + message.id);
  }

  cancelTransmission(message: Message): void {
    console.log("sent-messages component, cancel transmission, message:  ", message);
  }

  getMessages(): void {
    this.messageService.getMessages().subscribe(
      (res: any) => {
        this.draftMessages = res.filter(a => a.draft == true && a.inbox == false);
        this.sentMessages = res.filter(a => a.draft == false  && a.inbox == false);
        //console.log(this.filteredMessages);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  selectAll(): void {
    
  }


  getSentMessages(): void {
    this.messageService.getMessages().subscribe(
      (res: any) => {
        this.messages = res;
        this.filteredMessages = res.filter(a => a.inbox == true);
        console.log(this.filteredMessages);
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





