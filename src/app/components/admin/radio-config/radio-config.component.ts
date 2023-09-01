import { Component, OnInit, OnDestroy } from '@angular/core';
import { RadioService } from '../../../_services/radio.service';
import { NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { GlobalConstants } from '../../../global-constants';
import { ApiService } from 'src/app/_services/api.service';
import { SharedService } from 'src/app/_services/shared.service';
import { UtilsService } from 'src/app/_services/utils.service';

@Component({
  selector: 'app-radio-config',
  templateUrl: './radio-config.component.html',
  styleUrls: ['./radio-config.component.less'],
  providers: [DecimalPipe]
})

export class RadioConfigComponent implements OnInit {
  public radio: any = []
  error: Error
  alterFreq = false
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
  realValue: number;
  freqmin = 500;
  freqmax = 30000;
  min = 500000;
  max = 300000000;
  shuttingDown = false;
  restarting = false;
  shuttingDownNow = false;
  rebootingDownNow = false;
  alertBrowserXP: Boolean = false
  loginForm = false;
  refthreshold: any
  power: any
  realfreq: any;
  led: any;
  ptt: any;
  frek: any;
  serial: string
  localUsing: boolean
  hasGps = GlobalConstants.hasGPS
  bitx = GlobalConstants.bitx

  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService,
    private apiService: ApiService,
    private sharedService: SharedService,
    private utils: UtilsService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  get value(): number {
    this.realValue = this.radio.freq;
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
    this.radioService.setRadioPTT(this.radio.tx == false ? 'ON' : 'OFF').subscribe(
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

  public pttOn(f) {
    this.radioService.setRadioPTT(f).subscribe(
      (res: any) => {
        this.radio.ptt = res;
        this.radio.tx = true;
        this.radio.rx = false;

        if (this.ptt == "ON") {
          this.testTone(0);
        }

        if (this.ptt == "OFF") {
          this.testTone(600);
        }
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  confirmReset() {
    this.reseting = this.reseting ? false : true
  }

  screenFreq(): void {
    this.alterFreq = this.alterFreq ? false : true
  }

  changeFrequency(f: NgForm) {
    this.loading = true
    const realfreq = f.value.frek * 1000;
    this.confirmSet = false
    this.radioService.setRadioFreq(realfreq).subscribe(
      (res: any) => {
        this.radio.freq = this.utils.formatFrequency(res);
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
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

  changeRefThreshold(f: NgForm) {
    this.loading = true
    this.radioService.setRadioRefThreshold(f.value.refthreshold).subscribe(
      (res: any) => {
        this.radio.refthreshold = res;
        this.loading = false
      }, (err) => {
        this.error = err;
        this.loading = false
        this.errorAlert = true;
      }
    );
  }

  confirmChange() {
    if (this.confirmSet) {
      this.confirmSet = false;
    } else {
      this.confirmSet = true;
    }
  }

  confirmChangePTT() {
    if(this.radio.tx == true){
      this.changePtt()
      return
    }

    if (this.confirmSendPTT) {
      this.confirmSendPTT = false;
    } else {
      this.confirmSendPTT = true;
    }
  }

  screenSet() {
    if (this.confirmSet) {
      this.confirmSet = false;
    } else {
      this.confirmSet = true;
    }
  }

  resetProtection() {
    this.radioService.radioResetProtection().subscribe(
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
    await this.radioService.radioRestoreDefaults().subscribe(
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

  submitSet() {
    this.confirmSet = this.confirmSet ? false : true
  }

  testTone(f) {
    this.testtone = f;
    this.radioService.setRadioTone(f).subscribe(
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

  // confirmShutDown() {
  //   this.shuttingDown = true;
  // }

  // cancelShutDown() {
  //   this.shuttingDown = false;
  //   this.shuttingDownNow = false;
  // }

  confirmReboot() {
    this.restarting = true;
  }

  cancelReboot() {
    this.restarting = false;
    this.shuttingDownNow = false;
  }

  confirmRestart() {
    this.restarting = true;
  }

  cancelRestart() {
    this.restarting = false;
    this.shuttingDownNow = false;
  }

  // shutDown() {
  //   this.shuttingDownNow = true;
  //   this.apiService.sysShutdown();
  // }

  reboot() {
    this.rebootingDownNow = true;
    this.apiService.sysReboot();
  }

  getRadioStatus() {
    this.loading = true
    this.radioService.getRadioStatus().subscribe(
      (res: any) => {
        this.refthreshold = res.refthreshold;
        this.serial = res.serial;
        // this.ptt = this.radio.tx ? 'ON' : 'OFF'
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
      }
    );
  }

  ngOnInit(): void {
    this.getRadioStatus()
    this.radio = this.sharedService.radioObj.value
    this.modeSwitch = this.radio.mode == 'LSB' ? true : false;
    this.frek = this.radio.freq
    this.isAdmin = this.currentUser && this.currentUser.admin
    this.loading = false
  }
}

