import { Component, Input, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { RadioService } from 'src/app/_services/radio.service';
import { interval } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';
import { NgForm } from '@angular/forms';
import { UtilsService } from 'src/app/_services/utils.service';

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
  step: number = 0
  modeSwitch: boolean
  placesArray: Array<String>
  inputFrequencyFlag: Boolean = false
  freqmin: number = 500
  freqmax: number = 30000
  frequencyAux: String


  @Input() radioObj: Radio

  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService,
    private sharedService: SharedService,
    private utils: UtilsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  public closeError() {
    this.errorAlert = false;
  }

  changeMode(event) {
    this.modeSwitch = this.modeSwitch === true ? false : true;
    this.radioService.setRadioMode(this.modeSwitch ? 'LSB' : 'USB').subscribe(
      (res: any) => {

      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  changeStep() {

    this.step --

    if(this.step < 0){
      this.step = this.placesArray.length - 1
    }

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

    this.frequencyAux = this.radio.freq.toString()
    this.frequencyAux = this.frequencyAux.replace(/,/g, "")
    this.frequencyAux = this.frequencyAux.replace(/\./g, "")
    console.log(this.frequencyAux)

    this.placesArray = this.frequencyAux.toString().split('')

    this.step = this.placesArray.length -1
    console.log(this.step)
  }

  showInputFrequency() {
    if (this.inputFrequencyFlag)
      this.inputFrequencyFlag = false
    else
      this.inputFrequencyFlag = true
  }

  changeFrequency(f: NgForm) {
    this.loading = true
    this.radioService.setRadioFreq((f.value.frequency * 1000)).subscribe(
      (res: any) => {
        this.radio.freq = this.utils.formatFrequency(res);
        this.loading = false
        this.inputFrequencyFlag = false
        this.splitFrequency()
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
        this.inputFrequencyFlag = false
      }
    );
  }

  ngOnChanges(change) {
    change.radioObj && change.radioObj.currentValue != change.radioObj.previousValue ? this.radio = change.radioObj.currentValue : null

    this.splitFrequency()
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value
    // this.frequency = this.radio.freq
    this.modeSwitch = this.radio.mode == 'LSB' ? true : false;
    this.splitFrequency()

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    };
  }
}
