import { Component, OnInit } from '@angular/core';
import { Message } from '../message';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';
import { MessageService } from '../_services/message.service';
import { AlertService } from '../alert.service';



@Component({
  selector: 'app-messageadm',
  templateUrl: './messageadm.component.html',
  styleUrls: ['./messageadm.component.less']
})
export class MessageadmComponent implements OnInit {

  currentUser: User;
  error = '';
  success = '';
  test = '';
  messages: Message[];
  filteredMessages: Message[];
  message: Message;
  selectedMessages: boolean = false;
  isadmin = false;


  constructor(private messageService: MessageService, private alertService: AlertService,
      private authenticationService: AuthenticationService) { }

    loggedin() {
        if (this.isadmin) {
          this.isadmin = false;
        } else {
          this.isadmin = true;
        }
      }

  confirmDelete() {
    if (this.selectedMessages) {
      this.selectedMessages = false;
    } else {
      this.selectedMessages = true;
    }
    console.log('⚚ messageadm - confirmDelete selectMessages: ', this.selectedMessages);
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

  setUploadPermission(value: string) {
    console.log(value);
  }

  ngOnInit(): void {
    this.getMessages();

  }



}
