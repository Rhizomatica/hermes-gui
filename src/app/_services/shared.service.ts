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
    step: null
  });

  public storedRadioObj = <Radio>({
    freq: null,
    mode: null,
    tx: null,
    rx: null,
    fwd_watts: null,
    swr: null
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
    this.radioObj.next(this.radioObj.value)
  }

  mountRadioObj(newObj) {

    var utils = new UtilsService()

    this.storedRadioObj.freq = newObj.freq == null ? this.storedRadioObj.freq : utils.formatFrequency(newObj.freq)
    this.storedRadioObj.mode = newObj.mode == null ? this.storedRadioObj.mode : newObj.mode
    this.storedRadioObj.tx = newObj.tx == null ? this.storedRadioObj.tx : newObj.tx
    this.storedRadioObj.rx = newObj.rx == null ? this.storedRadioObj.rx : newObj.rx
    this.storedRadioObj.fwd_watts = newObj.fwd_watts == null ? this.storedRadioObj.fwd_watts : newObj.fwd_watts
    this.storedRadioObj.swr = newObj.swr == null ? this.storedRadioObj.swr : utils.formatSWR(newObj.swr)
  }
}
