import { Component, OnInit, OnDestroy } from '@angular/core';
import { RadioService } from '../../../_services/radio.service';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { GlobalConstants } from '../../../global-constants';
import { ApiService } from 'src/app/_services/api.service';
import { SharedService } from 'src/app/_services/shared.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-radio-config',
  templateUrl: './radio-config.component.html',
  styleUrls: ['./radio-config.component.less']
})

export class RadioConfigComponent implements OnInit, OnDestroy {
  public radio: any = []
  error!: Error
  confirmSet = false
  confirmSendPTT = false
  reseting = false
  errorAlert = false
  radioError = false
  testtone = '0'
  toneOn = false
  currentUser!: User
  isAdmin = false
  loading = true
  modeSwitch!: boolean
  gpsMessage: any
  realValue: number | undefined
  freqmin = 500
  freqmax = 30000
  restarting = false
  shuttingDownNow = false
  rebootingDownNow = false
  alertBrowserXP: boolean = false
  loginForm = false
  refthreshold: any
  voicePowerLevel!: number
  dataPowerLevel!: number
  p0_frek!: number
  p1_frek!: number
  serial!: string
  hasGps = GlobalConstants.hasGPS
  bitx = GlobalConstants.bitx
  eraseSDCard: boolean = false
  confirmChangeProtection: boolean = false
  toggleProfile: number = 1
  voiceModeSwitch: boolean = false
  dataModeProfileID: number = 0
  voiceModeProfileID: number = 1
  timeoutStatus: number = 0
  timeoutDefault: number = 600
  formatedTimeout: number = 0
  isArabic: boolean = false
  toggleDigital: number = 0
  p0_frekFocused: boolean = false
  p1_frekFocused: boolean = false
  private radioSubscription!: Subscription

  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService,
    private apiService: ApiService,
    private sharedService: SharedService,
    private utils: UtilsService,
    private router: Router
  ) {
    this.isArabic = this.utils.isArabic();
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get value(): number | undefined {
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
    this.radioService.setRadioPTT(this.radio.tx == false ? 'ON' : 'OFF', this.dataModeProfileID).subscribe({
      next: (res: any) => {

        this.radio.tx = res == 'ON' ? true : false

        if (res == 'OFF') {
          this.testTone(0)
        }

        if (res === 'ON') {
          this.testTone(600)
        }

        this.confirmSendPTT = false
        this.loading = false

      },
      error: (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    });
  }

  public pttOn(f: string) {
    this.radioService.setRadioPTT(f, this.dataModeProfileID).subscribe({
      next: (res: any) => {
        this.radio.ptt = res;
        this.radio.tx = true;
        this.radio.rx = false;

        if (this.radio.ptt == "ON") {
          this.testTone(0);
        }

        if (this.radio.ptt == "OFF") {
          this.testTone(600);
        }
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    });
  }

  confirmReset() {
    this.reseting = !this.reseting
  }

  changeFrequency(f: NgForm, radioProfile: number) {
    this.loading = true
    const realfreq = f.value.frek * 1000;
    this.confirmSet = false

    this.radioService.setRadioFreq(realfreq, radioProfile).subscribe({
      next: (res: any) => {
        if (radioProfile == 0)
          this.radio.p0_freq = this.utils.formatFrequency(res);

        if (radioProfile == 1)
          this.radio.p1_freq = this.utils.formatFrequency(res);

        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    });
  }

  changeMode(radioProfile: number) {
    let mode: boolean | undefined;

    if (radioProfile === 0) {
      this.modeSwitch = !this.modeSwitch;
      mode = this.modeSwitch;
    } else if (radioProfile === 1) {
      this.voiceModeSwitch = !this.voiceModeSwitch;
      mode = this.voiceModeSwitch;
    }

    if (mode === undefined) return;

    this.radioService.setRadioMode(mode ? 'LSB' : 'USB', radioProfile).subscribe({
      next: (res: any) => { },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    });
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

    this.radioService.setRadioRefThreshold(f.value.refthreshold, this.dataModeProfileID).subscribe({
      next: (res: any) => {
        this.radio.refthreshold = res / 10;
        this.refthreshold = res / 10
        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
      }
    });
  }

  confirmChangePTT() {
    if (this.radio.tx) {
      this.changePtt()
      return
    }

    this.confirmSendPTT = !this.confirmSendPTT
  }

  resetProtection() {
    this.radioService.radioResetProtection(this.dataModeProfileID).subscribe({
      next: (res: any) => {
        if (res === 1) {
          this.radio.protection = false;
        }
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    });
  }

  async resetRadio() {
    this.radioService.radioRestoreDefaults(this.dataModeProfileID).subscribe({
      next: (res: any) => {
        this.reseting = false;
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
        this.reseting = false;
      }
    });
  }

  gpsStartCalibration() {
    this.radioService.gpsStartCalibration().subscribe({
      next: (res: any) => {
        this.gpsMessage = res
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    });
  }

  closeError() {
    this.errorAlert = false;
  }

  closeGPSMessage() {
    this.gpsMessage = null
  }

  testTone(f: number) {
    this.testtone = String(f);
    this.radioService.setRadioTone(String(f), this.dataModeProfileID).subscribe({
      next: (res: any) => {
        this.radio.testtone = res;
        this.toneOn = res === '0' ? false : true
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = err;
        this.errorAlert = true;
      }
    });
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
    this.radioService.getRadioStatus(this.voiceModeProfileID).subscribe({
      next: (res: any) => {
        this.refthreshold = res.refthreshold ? res.refthreshold / 10 : 0;
        this.serial = res.serial;
        return res;
      },
      error: (err) => {
        this.error = err;
        this.radioError = true;
      }
    });
  }

  eraseSDCardConfirmation() {
    if (this.eraseSDCard)
      return this.eraseSDCard = false

    this.eraseSDCard = true
  }

  callEraseSDCard() {
    this.radioService.eraseSDCard().subscribe({
      next: (res: any) => {
        return res;
      },
      error: (err) => {
        this.error = err;
        this.radioError = true;
      }
    });
  }

  changeProfile() {
    if (this.radio.connection)
      return

    this.loading = true

    this.toggleProfile = this.radio.profile === 0 ? 1 : 0;
    this.radioService.changeOperateModeProfile(this.toggleProfile).subscribe({
      next: (res: any) => {
        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    });
  }

  reload() {
    this.router.navigate(['/home']);
  }

  toggleTimeout() {

    const newTimeout = this.timeoutStatus === 0 ? this.timeoutDefault : -1;
    this.timeoutStatus = this.timeoutStatus === 0 ? 1 : 0;
    this.formatedTimeout = this.timeoutStatus === 0 ? 0 : this.timeoutDefault / 60;
    this.radioService.setTimeoutConfig(newTimeout).subscribe({
      next: (res: any) => {
      },
      error: (err) => {
        this.error = err
        this.errorAlert = true
      }
    });
  }

  getTimeoutConfig() {
    this.radioService.getTimeoutConfig().subscribe({
      next: (res: any) => {
        if (res < 0) {
          this.timeoutStatus = 0;
          this.formatedTimeout = 0;
        } else {
          this.timeoutStatus = 1;
          this.formatedTimeout = res / 60;
        }
      },
      error: (err) => {
        console.log(err);
        this.error = err;
        this.errorAlert = true;
      }
    });

  }

  changeTimeout(f: NgForm) {
    const newTimeout = f.value.timeout * 60;
    this.loading = true;
    this.radioService.setTimeoutConfig(newTimeout).subscribe({
      next: (res: any) => {
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false;
      }
    });
  }

  getRadioPowerLevel() {
    this.loading = true
    this.radioService.getRadioPowerLevel(0).subscribe({
      next: (res: any) => {
        this.dataPowerLevel = res;
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    });

    this.radioService.getRadioPowerLevel(1).subscribe({
      next: (res: any) => {
        this.voicePowerLevel = res;
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    });
  }

  updatePowerLevel(f: NgForm, profile: number) {
    this.loading = true
    f.value.profile = profile;
    f.value.powerLevel = profile === 0 ? this.dataPowerLevel : this.voicePowerLevel;

    this.radioService.setRadioPowerLevel(f.value).subscribe({
      next: (res: any) => {
        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
      }
    });
  }

  toggleDigitalVoice(event: any) {
    if (this.radio.p1_digital_voice == null) return

    this.loading = true;
    const digitalValue = this.radio.p1_digital_voice == true ? 0 : 1;

    this.radioService.toggleDigital(digitalValue).subscribe({
      next: (res: any) => {
        this.toggleDigital = res;
        this.radio.p1_digital_voice = res == 1 ? true : false
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false;
      }
    });
  }

  ngOnInit(): void {
    this.getRadioStatus()
    this.getTimeoutConfig()
    this.getRadioPowerLevel()
    this.isAdmin = this.currentUser?.admin

    this.radioSubscription = this.sharedService.radioObj.subscribe(radio => {
      this.radio = radio;
      this.voiceModeSwitch = radio.p1_mode === 'LSB';
      this.modeSwitch = radio.p0_mode === 'LSB';
      // Only update the frequency inputs when the user is not actively
      // editing them, so WS updates don't overwrite mid-typing.
      if (radio.p0_freq && !this.p0_frekFocused) {
        this.p0_frek = this.utils.parseFormattedFrequency(radio.p0_freq);
      }
      if (radio.p1_freq && !this.p1_frekFocused) {
        this.p1_frek = this.utils.parseFormattedFrequency(radio.p1_freq);
      }
    });

    this.loading = false
  }

  ngOnDestroy(): void {
    this.radioSubscription?.unsubscribe()
  }
}

