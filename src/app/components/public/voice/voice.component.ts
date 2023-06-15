import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
// import { WebsocketService } from '../../../_services/websocket.service';
// import { DecimalPipe } from '@angular/common';
import { RadioService } from 'src/app/_services/radio.service';
import { interval } from 'rxjs';

@Component({  
  selector: 'voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.less']
})

export class VoiceComponent implements OnInit {

  currentUser: User
  admin: Boolean
  loading: Boolean = false
  error: String
  errorAlert: Boolean = false
  frequency: number = 0
  mode: String
  radio: any
  intervallTimer = interval(900);
  subscription = null

  constructor(
    private authenticationService: AuthenticationService,
    // private websocketService: WebsocketService,
    private radioService: RadioService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  public closeError() {
    this.errorAlert = false;
  }

  getRadioStatus(): void {
    this.radioService.getRadioStatus().subscribe(
      (res: any) => {
        this.radio = res
        this.frequency = this.radio.freq == '' || this.radio.freq == null ? 0 : this.radio.freq  / 1000
        this.mode = this.radio.mode
        this.loading = false        
      },
      (err) => {
        this.error = err;
        this.loading = false;
      }
    );
  }

  setUSB() {
    this.changeMode('USB')
  }

  setLSB(){
    this.changeMode('LSB')
  }

  changeMode(mode){
    this.radioService.setRadioMode(mode).subscribe(
      (res: any) => {
        this.radio.mode = res;
        this.mode = this.radio.mode
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  ngOnInit(): void {
    this.subscription = this.intervallTimer.subscribe(() => this.getRadioStatus());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    };
  }
}
