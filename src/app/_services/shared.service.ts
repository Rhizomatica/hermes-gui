import { Injectable } from '@angular/core';
import { BehaviorSubject, empty } from 'rxjs';
import { Radio } from '../interfaces/radio';
import { UtilsService } from './utils.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  router: Router

  public radioObj = new BehaviorSubject<Radio>({
    freq: null,
    digital_frequency: null,
    analog_frequency: null,
    mode: null,
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
    volume: null,
    profile: null
  });

  public storedRadioObj = <Radio>({
    connection: null,
    freq: null,
    digital_frequency: null,
    analog_frequency: null,
    mode: null,
    tx: null,
    rx: null,
    fwd_watts: null,
    swr: '1.0',
    protection: null,
    volume: null,
    profile: null
  });

  setRadioObjShared(data) {
    //TODO - Dual frequency
    // this.observeOperatingProfileMode(data)
    this.mountRadioObj(data)
    this.setSharedObj()
  }

  setSharedObj() {
    this.radioObj.value.connection = this.storedRadioObj.connection
    this.radioObj.value.freq = this.storedRadioObj.freq
    this.radioObj.value.digital_frequency = this.storedRadioObj.digital_frequency
    this.radioObj.value.analog_frequency = this.storedRadioObj.analog_frequency
    this.radioObj.value.mode = this.storedRadioObj.mode
    this.radioObj.value.tx = this.storedRadioObj.tx
    this.radioObj.value.rx = this.storedRadioObj.rx
    this.radioObj.value.fwd_watts = this.storedRadioObj.fwd_watts
    this.radioObj.value.swr = this.storedRadioObj.swr
    this.radioObj.value.protection = this.storedRadioObj.protection
    this.radioObj.value.volume = this.storedRadioObj.volume
    this.radioObj.value.profile = this.storedRadioObj.profile

    this.radioObj.next(this.radioObj.value)
  }

  mountRadioObj(newObj) {

    var utils = new UtilsService()

    this.storedRadioObj.connection = newObj.connection == null ? this.storedRadioObj.connection : newObj.connection
    this.storedRadioObj.freq = newObj.freq == null ? this.storedRadioObj.freq : utils.formatFrequency(newObj.freq)
    this.storedRadioObj.digital_frequency = newObj.digital_frequency == null ? this.storedRadioObj.digital_frequency : utils.formatFrequency(newObj.digital_frequency)
    this.storedRadioObj.analog_frequency = newObj.analog_frequency == null ? this.storedRadioObj.analog_frequency : utils.formatFrequency(newObj.analog_frequency)
    this.storedRadioObj.mode = newObj.mode == null ? this.storedRadioObj.mode : newObj.mode
    this.storedRadioObj.tx = newObj.tx == null ? this.storedRadioObj.tx : newObj.tx
    this.storedRadioObj.rx = newObj.rx == null ? this.storedRadioObj.rx : newObj.rx
    this.storedRadioObj.fwd_watts = newObj.fwd_watts == null ? this.storedRadioObj.fwd_watts : utils.formatPower(newObj.fwd_watts)
    this.storedRadioObj.swr = newObj.swr == null ? this.storedRadioObj.swr : utils.formatSWR(newObj.swr)
    this.storedRadioObj.protection = newObj.protection == null ? this.storedRadioObj.protection : newObj.protection
    this.storedRadioObj.volume = newObj.volume == null ? this.storedRadioObj.volume : newObj.volume
    this.storedRadioObj.profile = newObj.profile == null ? this.storedRadioObj.profile : newObj.profile
  }

  mountRadioObjDemo() {
    var utils = new UtilsService()

    this.radioObj.value.connection = false
    this.radioObj.value.freq = utils.formatFrequency(1085500)
    this.radioObj.value.digital_frequency = utils.formatFrequency(1085500)
    this.radioObj.value.analog_frequency = utils.formatFrequency(1085500)
    this.radioObj.value.mode = 'USB'
    this.radioObj.value.tx = false
    this.radioObj.value.rx = true
    this.radioObj.value.fwd_watts = '1.0'
    this.radioObj.value.swr = '1.98'
    this.radioObj.value.protection = null
    this.radioObj.value.volume = 60
    this.radioObj.value.profile = 1
    this.radioObj.next(this.radioObj.value)
  }

  observeOperatingProfileMode(data) {
    if (data.profile != null && data.profile !== this.storedRadioObj.profile) {
      if (data.profile == 1) { //analog
        this.router.navigate(['/voice']);
      }
    }
  }
}
