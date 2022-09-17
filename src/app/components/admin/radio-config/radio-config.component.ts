import { Component, OnInit, OnDestroy } from '@angular/core';
import { RadioService } from '../../../_services/radio.service';
// import { WebsocketService } from '../../../_services/websocket.service';
import { NgForm } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { interval } from 'rxjs';
import { GlobalConstants } from '../../../global-constants';

@Component({
  selector: 'app-radio-config',
  templateUrl: './radio-config.component.html',
  styleUrls: ['./radio-config.component.less'],
  providers: [DecimalPipe,
    // WebsocketService,
    // {provide: '_serviceRoute', useValue: 'radio/power'}
    // {provide: '_serviceRoute', useValue: 'WSaudioRX'}
  ]
})

export class RadioConfigComponent implements OnInit, OnDestroy {
  public radio: any = [];
  error: Error;
  alterFreq = false;
  // alterSet = false;
  confirmSet = false;
  res: any;
  ptt: any;
  // bfo: any;
  // mastercal: any;
  freq: any;
  frek: any;
  realfreq: any;
  reseting = false;
  usb = true;
  mode: any;
  led: any;
  protection: any;
  bypass: any;
  public realValue: number;
  public freqmin = 500;
  public freqmax = 30000;
  errorAlert = false;
  radioError = false;
  testtone = '0';
  toneOn = false;
  currentUser: User;
  isAdmin = false;
  refthreshold: any;
  public min = 500000;
  public max = 300000000;
  public intervallTimer = interval(900);
  private subscription;
  // fwdw: any;
  // fwd_raw: any;
  fwd_watts: any;
  fwd_volts: any;
  ref_raw: any;
  ref_watts: any;
  ref_volts: any;
  tx = false;
  rx = false;
  power: any;
  // audio: any;
  connected: any;
  modeSwitch: boolean;
  loading = true
  gpsMessage: any
  hasGps = GlobalConstants.hasGPS

  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService,
    // private websocketService: WebsocketService
    ) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

      // websocketService.messages.subscribe(msg => {
      //   // this.power = msg;
      //   console.log(msg);
      // });
    }

  getRadioStatus(): void {
    this.radioService.getRadioStatus().subscribe(
      (res: any) => { //TODO - pegar só o necessário
        this.radio = res;
        this.radio.extra = false;
        // this.bfo = this.radio.bfo;
        // this.mastercal = this.radio.mastercal;
        this.freq = this.radio.freq;
        this.frek = this.radio.freq / 1000;
        this.mode = this.radio.mode;
        this.modeSwitch = this.radio.mode == 'LSB' ? true : false;
        this.led = this.radio.led;
        this.protection = this.radio.protection;
        this.bypass = this.radio.bypass;
        this.refthreshold = this.radio.refthreshold;
        this.radio.fwd_watts = this.radio.fwd_watts;
        this.radio.serial = this.radio.serial;
        this.radio.testTone = this.radio.testtone;
        this.bypass = this.radio.bypass ? 'ON' : 'OFF'
        this.connected = this.radio.bypass ? 'connected' : 'disconnected';
        this.ptt = this.radio.tx ? 'ON' : 'OFF'
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
      }
    );
  }

  getPttswr(): void {
    this.radioService.getRadioPttswr().subscribe(
      (res: any) => {
        this.power = res;
        this.radio.swr = this.power.swr;
        this.radio.swr_str = this.power.swr.toString();
        this.radio.tx = this.power.tx;
        this.radio.led = this.power.led;
        this.led = this.power.led;
        this.radio.protection = this.power.protection;
        this.radio.bypass = this.power.bypass;
        this.radio.fwd_watts = this.power.fwd_watts;
        // this.radio.fwd_raw = this.power.fwd_raw;
        this.radio.fwd_volts = this.power.fwd_volts;
        this.radio.ref_volts = this.power.ref_volts;
        this.radio.ref_raw = this.power.ref_raw;
        this.radio.ref_watts = this.power.ref_watts;
        // this.bypass = this.radio.bypass ? true : false
        this.ptt = this.radio.tx ? 'ON' : 'OFF'
        this.loading = false
        return res;
      },
      (err) => {
        this.error = err;
        this.radioError = true;
        this.loading = false
      }
    );
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


  changePtt(event) {
    this.loading = true
    this.radioService.setRadioPTT(this.ptt == 'ON' ? 'OFF' : 'ON').subscribe(
      (res: any) => {
        this.res = res;
        this.radio.ptt = res;
        // this.ptt = this.radio.ptt;
        this.radio.tx = this.ptt === 'ON' ? true : false
        this.radio.rx = this.ptt === 'ON' ? false : true

        if(this.ptt == "ON"){
          this.testTone(0);
        }

        if(this.ptt == "OFF"){
          this.testTone(600);
        }

      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.getRadioStatus;
      }
    );
  }

  public pttOn(f) {
    this.radioService.setRadioPTT(f).subscribe(
      (res: any) => {
        this.res = res;
        this.radio.ptt = res;
        // this.ptt = f;
        this.radio.tx = true;
        this.radio.rx = false;

        if(this.ptt == "ON"){
          this.testTone(0);
        }

        if(this.ptt == "OFF"){
          this.testTone(600);
        }
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );

    this.getPttswr();
  }

  confirmReset() {
    this.reseting = this.reseting ? false : true
  }

  screenFreq(): void {
    this.alterFreq = this.alterFreq ? false : true
  }

  // changeRadioFreqMode(f: NgForm) {
  //   this.radioService.setRadioFreq(f.value.freq).subscribe(
  //     (res: any) => {
  //       this.res = res;
  //       this.radio.freq = res;
  //     }, (err) => {
  //       this.error = err;
  //       this.errorAlert = true;
  //     }
  //   );

  //   this.radioService.setRadioMode(f.value.mode).subscribe(
  //     (res: any) => {
  //       this.res = res;
  //     }, (err) => {
  //       this.error = err;
  //       this.errorAlert = true;
  //     }
  //   );
  // }

  changeFrequency(f: NgForm) {
    this.loading = true
    const realfreq = f.value.frek * 1000;
    this.radioService.setRadioFreq(realfreq).subscribe(
      (res: any) => {
        this.res = res;
        this.radio.freq = res;
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
        this.res = res;
        this.radio.mode = res;
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  // changeBfo(f: NgForm) {
  //   this.radioService.setRadioBfo(f.value.bfo).subscribe(
  //     (res: any) => {
  //       this.res = res;
  //       this.radio.bfo = res;
  //     }, (err) => {
  //       this.error = err;
  //       this.errorAlert = true;
  //     }
  //   );
  // }

  // changeMasterCall(f: NgForm) {
  //   this.radioService.setRadioMastercal(f.value.mastercal).subscribe(
  //     (res: any) => {
  //       this.res = res;
  //       this.radio.mastercal = res;
  //     }, (err) => {
  //       this.error = err;
  //       this.errorAlert = true;
  //     }
  //   );
  // }

  // changeByPass(f: NgForm) {
  //   this.radioService.setRadioBypass(f.value.bypass).subscribe(
  //     (res: any) => {
  //       this.res = res;
  //       this.radio.bypass = res;
  //     }, (err) => {
  //       this.error = err;
  //       this.errorAlert = true;
  //     }
  //   );
  // }

  changeRefThreshold(f: NgForm) {
    this.radioService.setRadioRefThreshold(f.value.refthreshold).subscribe(
      (res: any) => {
        this.res = res;
        this.radio.refthreshold = res;
      }, (err) => {
        this.error = err;
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

  screenSet() {
    // if (this.alterSet === false) {
    // this.alterSet = true;
    if (this.confirmSet) {
      this.confirmSet = false;
    } else {
      this.confirmSet = true;
    }
  }
  // else {
  // this.alterSet = false;
  // }
  // }

  // setDefaults() {
  //   this.radioService.radioSetDefaults().subscribe(
  //     (res: any) => {
  //       this.res = res;
  //       this.radio.refthreshold = res;
  //     }, (err) => {
  //       this.error = err;
  //       this.errorAlert = true;
  //     }
  //   );
  // }

  resetProtection() {
    this.radioService.radioResetProtection().subscribe(
      (res: any) => {
        this.res = res;
        if (this.res === 1) {
          this.radio.protection = false;
        }
        this.getRadioStatus();
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
        this.res = res;
        this.reseting = false;
        this.getRadioStatus();
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.reseting = false;
        this.getRadioStatus();
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

  closeGPSMessage(){
    this.gpsMessage = null
  }

  submitSet() {
    this.confirmSet = this.confirmSet ? false : true
  }

  testTone(f) {
    this.testtone = f;
    this.radioService.setRadioTone(f).subscribe(
      (res: any) => {
        this.res = res;
        this.radio.testtone = res;
        this.toneOn = res === '0' ? false : true
        this.getRadioStatus();
        this.loading = false
      }, (err) => {
        this.loading = false
        this.error = err;
        this.errorAlert = true;
        this.getRadioStatus();
      }
    );
  }

  ngOnInit(): void {
    this.getRadioStatus();
    this.getPttswr();
    this.subscription = this.intervallTimer.subscribe(() => this.getPttswr());
    this.usb = this.radio && this.radio.mode
    this.isAdmin = this.currentUser && this.currentUser.admin
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

