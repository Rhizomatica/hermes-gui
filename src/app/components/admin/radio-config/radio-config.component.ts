import { Component, OnInit } from '@angular/core';
import { RadioService } from '../../../_services/radio.service';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { GlobalConstants } from '../../../global-constants';
import { ApiService } from 'src/app/_services/api.service';
import { SharedService } from 'src/app/_services/shared.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-radio-config',
  templateUrl: './radio-config.component.html',
  styleUrls: ['./radio-config.component.less']
})

export class RadioConfigComponent implements OnInit {
  public radio: any = []
  error: Error
  confirmSet = false
  confirmSendPTT = false
  reseting = false
  errorAlert = false
  radioError = false
  testtone = '0'
  toneOn = false
  currentUser: User
  isAdmin = false
  loading = true
  modeSwitch: boolean
  gpsMessage: any
  realValue: number
  freqmin = 500
  freqmax = 30000
  restarting = false
  shuttingDownNow = false
  rebootingDownNow = false
  refthreshold: any
  voicePowerLevel: number
  dataPowerLevel: number
  p0_frek: number
  p1_frek: number
  serial: string
  hasGps = GlobalConstants.hasGPS
  bitx = GlobalConstants.bitx
  eraseSDCard: boolean = false
  confirmChangeProtection: boolean = false
  toggleProfile: number = 1
  voiceModeSwitch: boolean
  dataModeProfileID: number = 0
  voiceModeProfileID: number = 1
  timeoutStatus: number = 0
  timeoutDefault: number = 600
  formatedTimeout: number = 0
  isArabic: boolean = GlobalConstants.localeId == 'ar' ? true : false
  toggleDigital: number = 0

  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService,
    private apiService: ApiService,
    private sharedService: SharedService,
    private utils: UtilsService,
    private router: Router
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get value(): number {
    this.realValue = this.radio.p1_freq;
    return this.realValue;
  }

  set value(newValue: number) {
    this.realValue = newValue;
    if (this.realValue < this.freqmin) {
      this.realValue = undefined;
      setTimeout(() => { this.realValue = this.freqmin; });
    }
    else if (this.realValue > this.freqmax) {
      this.realValue = undefined;
      setTimeout(() => { this.realValue = this.freqmax; });
    }
  }

  changePtt() {
    this.loading = true
    this.radioService.setRadioPTT(this.radio.tx == false ? 'ON' : 'OFF', this.dataModeProfileID).subscribe(
      (res: any) => {

        this.radio.tx = res == 'ON' ? true : false

        if (res == 'OFF') {
          this.testTone(0)
        }

        if (res === 'ON') {
          this.testTone(600)
        }

        this.confirmSendPTT = false
        this.loading = false

      }, (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  confirmReset() {
    this.reseting = !this.reseting
  }

  changeFrequency(f: NgForm, radioProfile: number) {
    this.loading = true
    const realfreq = f.value.frek * 1000;
    this.confirmSet = false

    this.radioService.setRadioFreq(realfreq, radioProfile).subscribe(
      (res: any) => {
        if (radioProfile == 0)
          this.radio.p0_freq = this.utils.formatFrequency(res);

        if (radioProfile == 1)
          this.radio.p1_freq = this.utils.formatFrequency(res);

        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  changeMode(event, radioProfile: number) {
    let mode: boolean;

    if (radioProfile === 0) {
      this.modeSwitch = !this.modeSwitch;
      mode = this.modeSwitch;
    } else if (radioProfile === 1) {
      this.voiceModeSwitch = !this.voiceModeSwitch;
      mode = this.voiceModeSwitch;
    }

    this.radioService.setRadioMode(mode ? 'LSB' : 'USB', radioProfile).subscribe(
      (res: any) => {},
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  confirmChange() {
    this.confirmSet = !this.confirmSet
  }

  confirmChangeThreshold() {
    this.confirmChangeProtection = !this.confirmChangeProtection
  }

  changeRefThreshold(f: NgForm) {
    this.confirmChangeProtection = false
    this.loading = true

    if (f.value.refthreshold) {
      f.value.refthreshold = f.value.refthreshold * 10
    }

    this.radioService.setRadioRefThreshold(f.value.refthreshold, this.dataModeProfileID).subscribe(
      (res: any) => {
        this.radio.refthreshold = res / 10;
        this.refthreshold = res / 10
        this.loading = false
      }, (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
      }
    );
  }

  confirmChangePTT() {
    if (this.radio.tx == true) {
      this.changePtt()
      return
    }

    this.confirmSendPTT = !this.confirmSendPTT
  }

  resetProtection() {
    this.radioService.radioResetProtection(this.dataModeProfileID).subscribe(
      (res: any) => {
        if (res === 1) {
          this.radio.protection = false;
        }
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  async resetRadio() {
    await this.radioService.radioRestoreDefaults(this.dataModeProfileID).subscribe(
      (res: any) => {
        this.reseting = false;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.reseting = false;
      }
    );
  }

  gpsStartCalibration() {
    this.radioService.gpsStartCalibration().subscribe(
      (res: any) => {
        this.gpsMessage = res
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  closeError() {
    this.errorAlert = false;
  }

  closeGPSMessage() {
    this.gpsMessage = null
  }

  testTone(f) {
    this.testtone = f;
    this.radioService.setRadioTone(f, this.dataModeProfileID).subscribe(
      (res: any) => {
        this.radio.testtone = res;
        this.toneOn = res === '0' ? false : true
        this.loading = false
      }, (err) => {
        this.loading = false
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  confirmReboot() {
    this.restarting = true;
  }

  cancelReboot() {
    this.restarting = false;
    this.shuttingDownNow = false;
  }

  reboot() {
    this.rebootingDownNow = true;
    this.apiService.sysReboot();
  }

  getRadioStatus() {
    this.loading = true
    this.radioService.getRadioStatus(this.voiceModeProfileID).subscribe(
      (res: any) => {
        this.refthreshold = res.refthreshold ? res.refthreshold / 10 : 0;
        this.serial = res.serial;
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
      }
    );
  }

  eraseSDCardConfirmation() {
    if (this.eraseSDCard)
      return this.eraseSDCard = false

    this.eraseSDCard = true
  }

  callEraseSDCard() {
    this.radioService.eraseSDCard().subscribe(
      (res: any) => {
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
      }
    );
  }

  changeProfile(event) {

    if (this.radio.connetion)
      return

    this.toggleProfile = this.radio.profile === 0 ? 1 : 0;
    this.radioService.changeOperateModeProfile(this.toggleProfile).subscribe(
      (res: any) => {},
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  reload() {
    this.router.navigate(['/home']);
  }

  toggleTimeout() {
    const newTimeout = this.timeoutStatus === 0 ? this.timeoutDefault : -1;
    this.timeoutStatus = this.timeoutStatus === 0 ? 1 : 0;
    this.formatedTimeout = this.timeoutStatus === 0 ? 0 : this.timeoutDefault / 60;

    this.radioService.setTimeoutConfig(newTimeout).subscribe(
      (res: any) => {},
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  getTimeoutConfig() {
    this.radioService.getTimeoutConfig().subscribe(
      (res: any) => {
        if (res < 0) {
          this.timeoutStatus = 0;
          this.formatedTimeout = 0;
        } else {
          this.timeoutStatus = 1;
          this.formatedTimeout = res / 60;
        }
      },
      (err) => {
        console.log(err);
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  changeTimeout(f: NgForm) {
    const newTimeout = f.value.timeout * 60;
    this.loading = true;
    this.radioService.setTimeoutConfig(newTimeout).subscribe(
      (res: any) => {
        this.loading = false;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false;
      }
    );
  }

  getRadioPowerLevel() {
    this.loading = true
    this.radioService.getRadioPowerLevel(0).subscribe(
      (res: any) => {
        this.dataPowerLevel = res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );

    this.radioService.getRadioPowerLevel(1).subscribe(
      (res: any) => {
        this.voicePowerLevel = res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

   updatePowerLevel(f: NgForm, profile: number) {
    this.loading = true
    f.value.profile = profile;
    f.value.powerLevel = profile === 0 ? this.dataPowerLevel : this.voicePowerLevel;

    this.radioService.setRadioPowerLevel(f.value).subscribe(
      (res: any) => {
        this.loading = false
      }, (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
      }
    );
  }


  toggleDigitalVoice(event) {

    if (this.radio.connetion)
      return

    this.toggleDigital = this.toggleDigital === 0 ? 1 : 0;
    this.radioService.toggleDigital(this.toggleDigital).subscribe(
      (res: any) => {},
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  ngOnInit(): void {
    this.getRadioStatus()
    this.getTimeoutConfig()
    this.radio = this.sharedService.radioObj.value
    this.voiceModeSwitch = this.radio.p1_mode === 'LSB'
    this.modeSwitch = this.radio.p0_mode === 'LSB'
    this.p0_frek = parseFloat((parseFloat(this.radio.p0_freq) * 1000).toFixed(2))
    this.p1_frek = parseFloat((parseFloat(this.radio.p1_freq) * 1000).toFixed(2))
    this.getRadioPowerLevel();
    this.isAdmin = this.currentUser?.admin
    this.loading = false
  }
}

