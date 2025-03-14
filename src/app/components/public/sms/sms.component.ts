import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { SMSMessageService } from 'src/app/_services/smsmessage.service';
import { SMSMessage } from 'src/app/interfaces/smsmessage';
import { NgForm } from '@angular/forms';
import { GlobalConstants } from '../../../global-constants';
import { Router } from '@angular/router';

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
  startChat: boolean = false
  phoneNumber: string = ""
  phoneNumberValidator: boolean = false

  constructor(
    private router: Router,
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

      if (!this.filteredMessages || this.filteredMessages.length == 0) {
        this.filteredMessages.push(this.messages[i]);
        continue
      }

      if (this.filteredMessages.map(e => e.phoneNumber).indexOf(this.messages[i].phoneNumber) < 0) {
        this.filteredMessages.push(this.messages[i]);
      }
    }
  }

  newMessage() {
    if (this.startChat)
      return this.startChat = false

    if (!this.startChat)
      return this.startChat = true
  }

  validatePhoneNumber(f: NgForm) {

    //TODO - Define accepted formats

    const regex = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4,})[-. ]?([0-9]{4,})?$/;
    this.phoneNumberValidator = regex.test(f.value.phoneNumber);

    //tests
    // +1 123-456-7890
    // 07543219876
    // +44 20 7946 0500 ext 123
  }

  sendNewMessage(f: NgForm): void {
    this.startChat = false
    this.loading = true

    //TODO - Verify if this number is already in the list?

    this.message.id = 1
    this.message.text = `This is a SMS message from HERMES station - ${GlobalConstants.domain}`
    this.message.phoneNumber = f.value.phoneNumber
    this.message.type = 1 //sent
    this.message.date = this.utilsService.formatDate(new Date())

    this.smsMessageService.sendMessage(this.message).subscribe(
      (res: any) => {
        this.router.navigate([`/smschat/${res.id}}`]);
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false;
      }
    );
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
