import { Component, Input, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { RadioService } from 'src/app/_services/radio.service';
import { interval } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';

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

  @Input() radioObj: Object
  
  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService,
    private sharedService: SharedService
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
        this.frequency = this.radio.freq == '' || this.radio.freq == null ? 0 : this.radio.freq / 1000
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

  setLSB() {
    this.changeMode('LSB')
  }

  changeMode(mode) {
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

  ngOnChanges(change) {
    change.radioObj && change.radioObj.currentValue != change.radioObj.previousValue ? this.radioObj = change.radioObj.currentValue : null

    this.radio = this.radioObj

    this.frequency = this.radio.freq == '' || this.radio.freq == null ? 0 : this.radio.freq / 1000
    this.mode = this.radio.mode
    this.loading = false
  }

  ngOnInit(): void {
    console.log(this.sharedService.radioObj.value.frequency)
    this.radio = this.sharedService.radioObj
    // this.subscription = this.intervallTimer.subscribe(() => this.getRadioStatus());
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    };
  }
}
