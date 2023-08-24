import { Component, Input, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { RadioService } from 'src/app/_services/radio.service';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';
import { FormControl, NgForm } from '@angular/forms';
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
  mode: String
  radio: Radio
  step: number = null
  modeSwitch: boolean
  placesArray: Array<String>
  freqmin: number = 500
  freqmax: number = 30000
  frequencyAux: String

  subject = new BehaviorSubject(this.radioService);

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
    this.step--

    if (this.step < 0 || this.step == 0 && this.placesArray.length == 7) {
      this.step = this.placesArray.length - 1
    }

    this.updateStep()
  }

  splitFrequency() {
    if (!this.radio || !this.radio.freq || this.radio.freq == 0)
      return

    this.frequencyAux = this.radio.freq.toString()
    this.frequencyAux = this.frequencyAux.replace(/,/g, "")
    this.frequencyAux = this.frequencyAux.replace(/\./g, "")

    if (this.frequencyAux.length == 6)
      this.frequencyAux = "0" + this.frequencyAux

    if (this.frequencyAux.length == 5)
      this.frequencyAux = "00" + this.frequencyAux

    this.placesArray = this.frequencyAux.toString().split('')
  }

  changeFrequency(f: NgForm) {
    this.loading = true
    this.radioService.setRadioFreq((f.value.frequency * 1000)).subscribe(
      (res: any) => {
        this.radio.freq = this.utils.formatFrequency(res);
        this.loading = false
        this.splitFrequency()
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  setInitialStep() {
    if (this.placesArray.length > 0)
      this.step = this.placesArray.length - 1
  }

  changeStepDigit(index) {
    this.step = index
    this.updateStep()
  }

  getSavedStep() {
    this.loading = true
    this.radioService.getStep().subscribe(
      (res: any) => {

        this.loading = false

        if (res === null && this.radio.freq) {
          this.setInitialStep()
          return
        }

        this.setStepCode(res)

      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  updateStep() {
    this.radioService.updateStep(this.setStepValue()).subscribe(
      (res: any) => {
        if (res != true || res != 1) {
          this.error = res
          this.errorAlert = true;
        }

      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  setStepCode(value) {
    switch (value) {
      case 1000000:
        this.step = 1;
        break;
      case 100000:
        this.step = 2;
        break;
      case 10000:
        this.step = 3;
        break;
      case 1000:
        this.step = 4;
        break;
      case 100:
        this.step = 5;
        break;
      case 10:
        this.step = 6;
        break;
    }
  }

  setStepValue() {
    switch (this.step) {
      case 1:
        return 1000000;
      case 2:
        return 100000;
      case 3:
        return 10000;
      case 4:
        return 1000;
      case 5:
        return 100;
      case 6:
        return 10;
    }
  }

  updatePage() {
    this.errorAlert = false
    location.reload()
  }

  ngOnInit(): void {
    this.sharedService.radioObj.subscribe(message => {

      this.radio = this.sharedService.radioObj.value
      this.modeSwitch = this.radio.mode == 'LSB' ? true : false
      this.splitFrequency()
    })

    this.getSavedStep()
  }
}
