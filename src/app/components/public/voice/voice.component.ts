import { Component, Input, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { RadioService } from 'src/app/_services/radio.service';
import { BehaviorSubject } from 'rxjs';
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

  changeStepDigit(index){
      this.step = index
      this.updateStep()
  }

  updateStep() {
    // this.loading = true
    // this.radioService.updateStep(this.step).subscribe(
    //   (res: any) => {
    //    this.step = res.step
    //   }, (err) => {
    //     this.error = err;
    //     this.errorAlert = true;
    //     this.loading = false
    //   }
    // );
  }

  updatePage(){
    this.errorAlert = false
    location.reload()
  }

  ngOnInit(): void {
    this.sharedService.radioObj.subscribe(message => {

      this.radio = this.sharedService.radioObj.value
      this.modeSwitch = this.radio.mode == 'LSB' ? true : false
      this.splitFrequency()

      if (this.step === null && this.radio.freq) {
        this.setInitialStep()
      }
    })
  }
}
