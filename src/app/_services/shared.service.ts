import { Injectable } from '@angular/core';
import { BehaviorSubject, empty } from 'rxjs';
import { Radio } from '../interfaces/radio';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  public radioObj = new BehaviorSubject<Radio>({
    freq: null,
    mode: null,
    protection: null,
    tx: null,
    rx: null,
    led: null,
    fwd_raw: null,
    // fwd_volts: Number,
    fwd_watts: null,
    swr: null,
    ref_raw: null,
    // ref_volts: Number,
    ref_watts: null,
    connection: null,
    ptt: null,
    step: null,
    volume: null
  });

  public storedRadioObj = <Radio>({
    freq: null,
    mode: null,
    tx: null,
    rx: null,
    fwd_watts: null,
    swr: '1.0',
    protection: null,
    volume: null
  });

  setRadioObjShared(data) {
    this.mountRadioObj(data)
    this.setSharedObj()
  }

  setSharedObj() {
    this.radioObj.value.freq = this.storedRadioObj.freq
    this.radioObj.value.mode = this.storedRadioObj.mode
    this.radioObj.value.tx = this.storedRadioObj.tx
    this.radioObj.value.rx = this.storedRadioObj.rx
    this.radioObj.value.fwd_watts = this.storedRadioObj.fwd_watts
    this.radioObj.value.swr = this.storedRadioObj.swr
    this.radioObj.value.protection = this.storedRadioObj.protection
    this.radioObj.value.volume = this.storedRadioObj.volume
    this.radioObj.next(this.radioObj.value)
  }

  mountRadioObj(newObj) {

    var utils = new UtilsService()

    this.storedRadioObj.freq = newObj.freq == null ? this.storedRadioObj.freq : utils.formatFrequency(newObj.freq)
    this.storedRadioObj.mode = newObj.mode == null ? this.storedRadioObj.mode : newObj.mode
    this.storedRadioObj.tx = newObj.tx == null ? this.storedRadioObj.tx : newObj.tx
    this.storedRadioObj.rx = newObj.rx == null ? this.storedRadioObj.rx : newObj.rx
    this.storedRadioObj.fwd_watts = newObj.fwd_watts == null ? this.storedRadioObj.fwd_watts : utils.formatPower(newObj.fwd_watts)
    this.storedRadioObj.swr = newObj.swr == null ? this.storedRadioObj.swr : utils.formatSWR(newObj.swr)
    this.storedRadioObj.protection = newObj.protection == null ? this.storedRadioObj.protection : newObj.protection
    this.storedRadioObj.volume = newObj.volume == null ? this.storedRadioObj.volume : newObj.volume
  }

  mountRadioObjDemo(){
    var utils = new UtilsService()

    this.radioObj.value.freq = utils.formatFrequency(1085500)
    this.radioObj.value.mode = 'USB'
    this.radioObj.value.tx = false
    this.radioObj.value.rx = true
    this.radioObj.value.fwd_watts = '1.0'
    this.radioObj.value.swr = '1.98'
    this.radioObj.value.protection = null
    this.radioObj.value.volume = 60
    this.radioObj.next(this.radioObj.value)
  }
}
