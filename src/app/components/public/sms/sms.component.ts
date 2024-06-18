import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { SMSMessageService } from 'src/app/_services/smsmessage.service';
import { SMSMessage } from 'src/app/interfaces/smsmessage';

@Component({
  selector: 'sms',
  templateUrl: './sms.component.html',
  styleUrls: ['./sms.component.less']
})

export class SMSComponent implements OnInit {

  currentUser: User
  admin: boolean
  loading: boolean = false
  error: string
  errorAlert: boolean = false
  message: SMSMessage
  message1: SMSMessage
  messages: SMSMessage[]
  filteredMessages: SMSMessage[] = []

  constructor(
    private authenticationService: AuthenticationService,
    private smsMessageService: SMSMessageService,
    private utilsService: UtilsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  public closeError() {
    this.errorAlert = false
  }

  getMessages() {
    this.message.id = 1
    this.message.text = "Hello"
    this.message.phoneNumber = "+5531999885874"
    this.message.type = 0 //received
    this.message.date = this.utilsService.formatDate(new Date())

    this.messages.push(this.message)
    this.messages.push(this.message)
    this.messages.push(this.message)

    this.message1.id = 2
    this.message1.text = "Hello two"
    this.message1.phoneNumber = "+5531998874554"
    this.message1.type = 0 //received
    this.message1.date = this.utilsService.formatDate(new Date())
    this.messages.push(this.message1)


    // this.smsMessageService.getMessages().subscribe(
    //   (res: any) => {
    //     this.messages = res.filter(a => a.phoneNumber);
    //     this.filterMessages()
    //   },
    //   (err) => {
    //     this.error = err;
    //     this.errorAlert = true;
    //     this.loading = false;
    //   }
    // );

    this.filterMessages()
  }

  filterMessages() {
    for (var i in this.messages) {

      if(!this.filteredMessages || this.filteredMessages.length == 0){
        this.filteredMessages.push(this.messages[i]);
        continue
      }

      if (this.filteredMessages.map(e => e.phoneNumber).indexOf(this.messages[i].phoneNumber) < 0) {
        this.filteredMessages.push(this.messages[i]);
      }
    }
  }

  ngOnInit(): void {

    this.message = {
      id: 0,
      text: "",
      phoneNumber: "",
      type: 0,
      date: null,
    }

    this.message1 = {
      id: 0,
      text: "",
      phoneNumber: "",
      type: 0,
      date: null,
    }

    this.messages = []

    this.getMessages()
  }
}
