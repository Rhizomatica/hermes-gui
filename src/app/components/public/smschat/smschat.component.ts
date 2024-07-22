import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service'
import { UtilsService } from 'src/app/_services/utils.service'
import { SMSMessageService } from 'src/app/_services/smsmessage.service'
import { SMSMessage } from 'src/app/interfaces/smsmessage'
import { NgForm } from '@angular/forms'

@Component({
  selector: 'smschat',
  templateUrl: './smschat.component.html',
  styleUrls: ['./smschat.component.less']
})

export class SMSChatComponent implements OnInit {

  currentUser: User
  admin: boolean
  loading: boolean = false
  error: string
  errorAlert: boolean = false
  messages: SMSMessage[]
  phoneNumber: string = null
  message: SMSMessage = null
  message1: SMSMessage = null
  message2: SMSMessage = null
  delete: boolean = false
  chatId: number = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private smsMessageService: SMSMessageService,
    private utilsService: UtilsService,
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
    this.message.text = "Hello!!"
    this.message.phoneNumber = "+5531999885874"
    this.message.type = 0 //received
    this.message.date = this.utilsService.formatDate(new Date())
    this.messages.push(this.message)

    this.message1.id = 2
    this.message1.text = "How are you?"
    this.message1.phoneNumber = "+5531999885874"
    this.message1.type = 1 //sent
    this.message1.date = this.utilsService.formatDate(new Date())
    this.messages.push(this.message1)

    this.message2.id = 3
    this.message2.text = "Just testing the SMS message..."
    this.message2.phoneNumber = "+5531999885874"
    this.message2.type = 0 //received
    this.message2.date = this.utilsService.formatDate(new Date())
    this.messages.push(this.message2)

    this.phoneNumber = "+5531999885874"

    this.smsMessageService.getMessages().subscribe(
      (res: any) => {
        this.messages = res
        if (res && res.length > 0)
          this.phoneNumber = res[0].phoneNumber
      },
      (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  sendSMS(f: NgForm) {
    this.smsMessageService.sendMessage(this.message).subscribe(
      (res: any) => {
        this.messages.push(f.value.text)
      },
      (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  deleteConfirmation() {
    if (this.delete)
      return this.delete = false

    if (!this.delete)
      return this.delete = true

  }

  deleteChat() {
    this.delete = false
    this.loading = true
    this.smsMessageService.deleteMessage(this.chatId).subscribe(
      (res: any) => {
        this.loading = false
        this.router.navigate(['/sms'])
      },
      (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  ngOnInit(): void {

    this.chatId = parseInt(this.route.snapshot.paramMap.get('id'))

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

    this.message2 = {
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
