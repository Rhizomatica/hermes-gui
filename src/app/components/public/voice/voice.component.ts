import { Component, Input, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { RadioService } from 'src/app/_services/radio.service';
import { interval } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';

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
  intervallTimer = interval(900);
  subscription = null
  radio: Radio
  step: number = 1
  placesArray: Array<String>

  @Input() radioObj: Radio

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

  changeStep() {


    switch (this.step) {
      case 1:
        this.step++
        break;
      case 2:
        this.step++
        break;
      case 3:
        this.step = 1
        break;
    }

    // this.step
    // this.radioService.changeStep(this.step).subscribe(
    //   (res: any) => {
    //     this.step = res.radio.step
    //   }, (err) => {
    //     this.error = err;
    //     this.errorAlert = true;
    //   }
    // );
  }

  splitFrequency() {
    if (!this.radio || !this.radio.freq || this.radio.freq == 0)
      return

    var freqString = this.radio.freq.toString()

    this.placesArray = freqString.match(/.{1,3}/g);
  }

  ngOnChanges(change) {
    change.radioObj && change.radioObj.currentValue != change.radioObj.previousValue ? this.radio = change.radioObj.currentValue : null

    this.splitFrequency()
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value
    this.splitFrequency()
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    };
  }
}
