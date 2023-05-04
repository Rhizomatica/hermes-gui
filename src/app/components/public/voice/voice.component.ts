import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { WebsocketService } from '../../../_services/websocket.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.less'],
  providers: [DecimalPipe,
    WebsocketService,
    // { provide: '_serviceRoute', useValue: 'radio/power' },
    // { provide: '_serviceRoute', useValue: 'WSaudioRX' }
    { provide: '_serviceRoute', useValue: 'websocket' }
  ]
})

export class VoiceComponent implements OnInit {

  currentUser: User
  admin: Boolean
  loading: Boolean = false
  error: String
  errorAlert: Boolean = false
  frequency: number = 7140
  mode: String
  
  constructor(
    private authenticationService: AuthenticationService,
    private websocketService: WebsocketService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin

    websocketService.messages.subscribe(msg => {
      // this.power = msg;
      console.log(msg);
    });
  }

  public closeError() {
    this.errorAlert = false;
  }

  lsbVoice(){

  }

  usbVoice(){

  }

  ngOnInit(): void {

  }
}
