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

  router: Router

  public radioObj = new BehaviorSubject<Radio>({
    freq: null,
    digital_frequency: null,
    analog_frequency: null,
    digital_mode: null,
    analog_mode: null,
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
    profile_active_idx: null,
  });

  public storedRadioObj = <Radio>({
    connection: null,
    freq: null,
    digital_frequency: null,
    analog_frequency: null,
    digital_mode: null,
    analog_mode: null,
    tx: null,
    rx: null,
    fwd_watts: null,
    swr: '1.0',
    protection: null,
    volume: null,
    profile_active_idx: null
  });

  setRadioObjShared(data) {
    this.mountRadioObj(data)
    this.setSharedObj()
    this.observeOperatingProfileMode()
  }

  setSharedObj() {
    this.radioObj.value.connection = this.storedRadioObj.connection
    this.radioObj.value.freq = this.storedRadioObj.freq
    this.radioObj.value.digital_frequency = this.storedRadioObj.digital_frequency
    this.radioObj.value.analog_frequency = this.storedRadioObj.analog_frequency
    this.radioObj.value.digital_mode = this.storedRadioObj.digital_mode
    this.radioObj.value.analog_mode = this.storedRadioObj.analog_mode
    this.radioObj.value.tx = this.storedRadioObj.tx
    this.radioObj.value.rx = this.storedRadioObj.rx
    this.radioObj.value.fwd_watts = this.storedRadioObj.fwd_watts
    this.radioObj.value.swr = this.storedRadioObj.swr
    this.radioObj.value.protection = this.storedRadioObj.protection
    this.radioObj.value.volume = this.storedRadioObj.volume
    this.radioObj.value.profile_active_idx = this.storedRadioObj.profile_active_idx

    this.radioObj.next(this.radioObj.value)
  }

  mountRadioObj(newObj) {

    var utils = new UtilsService()

    this.storedRadioObj.connection = newObj.connection == null ? this.storedRadioObj.connection : newObj.connection
    this.storedRadioObj.freq = newObj.freq == null ? this.storedRadioObj.freq : utils.formatFrequency(newObj.freq)
    this.storedRadioObj.digital_frequency = newObj.digital_frequency == null ? this.storedRadioObj.digital_frequency : utils.formatFrequency(newObj.digital_frequency)
    this.storedRadioObj.analog_frequency = newObj.analog_frequency == null ? this.storedRadioObj.analog_frequency : utils.formatFrequency(newObj.analog_frequency)
    this.storedRadioObj.analog_mode = newObj.analog_mode == null ? this.storedRadioObj.analog_mode : newObj.analog_mode
    this.storedRadioObj.digital_mode = newObj.digital_mode == null ? this.storedRadioObj.digital_mode : newObj.digital_mode
    this.storedRadioObj.tx = newObj.tx == null ? this.storedRadioObj.tx : newObj.tx
    this.storedRadioObj.rx = newObj.rx == null ? this.storedRadioObj.rx : newObj.rx
    this.storedRadioObj.fwd_watts = newObj.fwd_watts == null ? this.storedRadioObj.fwd_watts : utils.formatPower(newObj.fwd_watts)
    this.storedRadioObj.swr = newObj.swr == null ? this.storedRadioObj.swr : utils.formatSWR(newObj.swr)
    this.storedRadioObj.protection = newObj.protection == null ? this.storedRadioObj.protection : newObj.protection
    this.storedRadioObj.volume = newObj.volume == null ? this.storedRadioObj.volume : newObj.volume
    this.storedRadioObj.profile_active_idx = newObj.profile_active_idx == null ? this.storedRadioObj.profile_active_idx : newObj.profile_active_idx
  }

  mountRadioObjDemo() {
    var utils = new UtilsService()

    this.radioObj.value.connection = false
    this.radioObj.value.freq = utils.formatFrequency(1085500)
    this.radioObj.value.digital_frequency = utils.formatFrequency(1085500)
    this.radioObj.value.analog_frequency = utils.formatFrequency(1085500)
    this.radioObj.value.digital_mode = 'USB'
    this.radioObj.value.analog_mode = 'USB'
    this.radioObj.value.tx = false
    this.radioObj.value.rx = true
    this.radioObj.value.fwd_watts = '1.0'
    this.radioObj.value.swr = '1.98'
    this.radioObj.value.protection = null
    this.radioObj.value.volume = 60
    this.radioObj.value.profile_active_idx = 1
    this.radioObj.next(this.radioObj.value)
  }

  observeOperatingProfileMode() {
    if (GlobalConstants.local && GlobalConstants.bitx == 'S' && this.radioObj.value.profile_active_idx != null && this.radioObj.value.profile_active_idx == 0) { //analog or fonia
      this.router.navigate(['/voice']); //navigate to voice (PTT hardware button)
    }
  }
}
