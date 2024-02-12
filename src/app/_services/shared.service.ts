import { Injectable } from '@angular/core';
import { BehaviorSubject, empty } from 'rxjs';
import { Radio } from '../interfaces/radio';
import { UtilsService } from './utils.service';
import { Router } from '@angular/router';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  constructor(private router: Router) { }

  public radioObj = new BehaviorSubject<Radio>({
    p0_freq: null,
    p1_freq: null,
    p0_mode: null,
    p1_mode: null,
    protection: null,
    tx: null,
    rx: null,
    led: null,
    fwd_raw: null,
    fwd_watts: null,
    swr: null,
    ref_raw: null,
    ref_watts: null,
    connection: null,
    ptt: null,
    step: null,
    p0_volume: null,
    p1_volume: null,
    profile: null,
    p1_freq_splited: null,
    p1_timeout_connection: null
  });

  public storedRadioObj = <Radio>({
    connection: null,
    led: null,
    p0_freq: null,
    p1_freq: null,
    p0_mode: null,
    p1_mode: null,
    tx: null,
    rx: null,
    fwd_watts: null,
    swr: '1.0',
    protection: null,
    p0_volume: null,
    profile: null,
    p1_freq_splited: null,
    p1_timeout_connection:null
  });

  setRadioObjShared(data) {
    this.mountRadioObj(data)
    this.setSharedObj()
    this.observeOperatingProfileMode()
  }

  setSharedObj() {
    this.radioObj.value.connection = this.storedRadioObj.connection
    this.radioObj.value.led = this.storedRadioObj.led
    this.radioObj.value.p0_freq = this.storedRadioObj.p0_freq
    this.radioObj.value.p1_freq = this.storedRadioObj.p1_freq
    this.radioObj.value.p0_mode = this.storedRadioObj.p0_mode
    this.radioObj.value.p1_mode = this.storedRadioObj.p1_mode
    this.radioObj.value.tx = this.storedRadioObj.tx
    this.radioObj.value.rx = this.storedRadioObj.rx
    this.radioObj.value.fwd_watts = this.storedRadioObj.fwd_watts
    this.radioObj.value.swr = this.storedRadioObj.swr
    this.radioObj.value.protection = this.storedRadioObj.protection
    this.radioObj.value.p1_volume = this.storedRadioObj.p1_volume
    this.radioObj.value.profile = this.storedRadioObj.profile
    this.radioObj.value.ptt = this.storedRadioObj.ptt
    this.radioObj.value.p1_freq_splited = this.storedRadioObj.p1_freq_splited
    this.radioObj.value.p1_timeout_connection = this.storedRadioObj.p1_timeout_connection
    this.radioObj.next(this.radioObj.value)
  }

  mountRadioObj(newObj) {

    var utils = new UtilsService()

    this.storedRadioObj.connection = newObj.connection == null ? this.storedRadioObj.connection : newObj.connection
    this.storedRadioObj.led = newObj.led == null ? this.storedRadioObj.led : newObj.led
    this.storedRadioObj.p0_freq = newObj.p0_freq == null ? this.storedRadioObj.p0_freq : utils.formatFrequency(newObj.p0_freq)
    this.storedRadioObj.p1_freq = newObj.p1_freq == null ? this.storedRadioObj.p1_freq : utils.formatFrequency(newObj.p1_freq)
    this.storedRadioObj.p0_mode = newObj.p0_mode == null ? this.storedRadioObj.p0_mode : newObj.p0_mode
    this.storedRadioObj.p1_mode = newObj.p1_mode == null ? this.storedRadioObj.p1_mode : newObj.p1_mode
    this.storedRadioObj.tx = newObj.tx == null ? this.storedRadioObj.tx : newObj.tx
    this.storedRadioObj.rx = newObj.rx == null ? this.storedRadioObj.rx : newObj.rx
    this.storedRadioObj.fwd_watts = newObj.fwd_watts == null ? this.storedRadioObj.fwd_watts : utils.formatPower(newObj.fwd_watts)
    this.storedRadioObj.swr = newObj.swr == null ? this.storedRadioObj.swr : utils.formatSWR(newObj.swr)
    this.storedRadioObj.protection = newObj.protection == null ? this.storedRadioObj.protection : newObj.protection
    this.storedRadioObj.p1_volume = newObj.p1_volume == null ? this.storedRadioObj.p1_volume : newObj.p1_volume
    this.storedRadioObj.profile = newObj.profile == null ? this.storedRadioObj.profile : newObj.profile
    this.storedRadioObj.ptt = newObj.ptt == null ? this.storedRadioObj.ptt : newObj.ptt
    this.storedRadioObj.p1_freq_splited = utils.splitFrequency(this.storedRadioObj.p1_freq)
    this.storedRadioObj.p1_timeout_connection = newObj.p1_timeout_connection == null ? this.storedRadioObj.p1_timeout_connection : newObj.p1_timeout_connection
  }

  mountRadioObjDemo() {
    var utils = new UtilsService()

    this.radioObj.value.connection = false
    this.radioObj.value.led = false
    this.radioObj.value.p0_freq = utils.formatFrequency(1085500)
    this.radioObj.value.p1_freq = utils.formatFrequency(1075000)
    this.radioObj.value.p0_mode = 'USB'
    this.radioObj.value.p1_mode = 'LSB'
    this.radioObj.value.tx = false
    this.radioObj.value.rx = true
    this.radioObj.value.fwd_watts = '1.0'
    this.radioObj.value.swr = '1.98'
    this.radioObj.value.protection = null
    this.radioObj.value.p0_volume = 60
    this.radioObj.value.profile = 1
    this.radioObj.value.ptt = false
    this.radioObj.value.p1_freq_splited = utils.splitFrequency(this.radioObj.value.p1_freq)
    this.radioObj.value.p1_timeout_connection = 300
    this.radioObj.next(this.radioObj.value)
  }

  observeOperatingProfileMode() {
    if (GlobalConstants.local && GlobalConstants.bitx == 'S' && this.radioObj.value && this.radioObj.value.profile == 1 && this.storedRadioObj.ptt == false && this.radioObj.value.ptt == true) { //analog or voice
      this.router.navigate(['/voice']); //navigate to voice (PTT hardware button)
    }
  }
}
