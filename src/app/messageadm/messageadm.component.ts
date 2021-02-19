import { Component, OnInit } from '@angular/core';
import { Message } from '../message';
import { MessageService } from '../_services/message.service';
import { AlertService } from '../alert.service';



@Component({
  selector: 'app-messageadm',
  templateUrl: './messageadm.component.html',
  styleUrls: ['./messageadm.component.less']
})
export class MessageadmComponent implements OnInit {

  error = '';
  success = '';
  test = '';
  messages: Message[];
  filteredMessages: Message[];
  message: Message;
  selectedMessages: boolean = false;
  

  constructor(private messageService: MessageService, private alertService: AlertService) { }

  confirmDelete() {
    if (this.selectedMessages) {
      this.selectedMessages = false;
    } else {
      this.selectedMessages = true;
    }
    console.log(this.selectedMessages);
 
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
