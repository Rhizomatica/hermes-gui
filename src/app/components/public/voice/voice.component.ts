import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { RadioService } from 'src/app/_services/radio.service';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'voice',
  templateUrl: './voice.component.html',
  styleUrls: ['./voice.component.less']
})

export class VoiceComponent implements OnInit {

  currentUser: User
  admin: boolean
  loading: boolean = false
  error: string
  errorAlert: boolean = false
  radio: Radio
  step: number = null
  modeSwitch: boolean
  freqmin: number = 500
  freqmax: number = 30000
  subject = new BehaviorSubject(this.radioService);
  voiceModeProfileID: number = 1

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
    this.errorAlert = false
  }

  changeMode(event) {
    this.modeSwitch = this.modeSwitch === true ? false : true;
    this.radioService.setRadioMode(this.modeSwitch ? 'LSB' : 'USB', this.voiceModeProfileID).subscribe(
      (res: any) => {

      }, (err) => {
        this.error = err
        this.errorAlert = true
      }
    );
  }

  changeStep() {
    this.step--

    if (this.step < 0 || this.step == 0 && this.radio.p1_freq_splited.length == 7) {
      this.step = this.radio.p1_freq_splited.length - 1
    }

    this.updateStep()
  }

  setInitialStep() {
    if (this.radio.p1_freq_splited.length > 0)
      this.step = this.radio.p1_freq_splited.length - 1
  }

  changeStepDigit(index) {

    if (index == 0)
      return

    this.step = index
    this.updateStep()
  }

  getSavedStep() {
    this.loading = true
    this.radioService.getStep().subscribe(
      (res: any) => {

        this.loading = false

        if (res === null && this.radio.p1_freq) {
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

  changeVolume(f: NgForm) {
    this.loading = true
    this.radioService.changeVolume(f.value.volume).subscribe(
      (res: any) => {
        this.loading = false
      }, (err) => {
        this.error = err;
        // this.errorAlert = true
        this.loading = false
      }
    );
  }

  resetProtection() {
    this.radioService.radioResetProtection(this.voiceModeProfileID).subscribe(
      (res: any) => {
        if (res === 1) {
          this.radio.protection = false
        }
      },
      (err) => {
        this.error = err
        this.errorAlert = true
      }
    );
  }

  changeOperateModeProfile() {
    //Profile id = 1 - voice / fonia
    if (this.radio.profile == 1)
      return

    this.loading = true
    this.radioService.changeOperateModeProfile(1).subscribe(
      (res: any) => {
        if (res === 1) {
          this.radio.profile = res.profile
          this.loading = false
        }
      },
      (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  restartVoiceTimeout() {
    if (parseInt(this.radio.timeout) <= 0)
      return

    this.radioService.restartVoiceTimeout().subscribe(
      (res: any) => {
        return res
      },
      (err) => {
        this.error = err
        this.errorAlert = true
      }
    );
  }

  ngOnInit(): void {
    this.radio = this.sharedService.radioObj.value
    this.modeSwitch = this.radio.p1_mode == 'LSB' ? true : false
    this.changeOperateModeProfile()
    this.getSavedStep()
  }
}
