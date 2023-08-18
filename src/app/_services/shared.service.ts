import { Injectable } from '@angular/core';
import { BehaviorSubject, empty } from 'rxjs';
import { Radio } from '../interfaces/radio';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  public radioObj = new BehaviorSubject<Radio>({
    // type: null,
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

  // storedRadioObj: Radio

  public storedRadioObj = <Radio>({
    // type: null,
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

  getLocalStorageRadio() {

    // var lsRadioObj = localStorage.getItem("radio")

    // if (!this.storedRadioObj) {
    //   return this.mountRadioEmptyObj()
    // }

    // return JSON.parse(this.oldRadioObj)
    // return this.storedRadioObj
  }

  // cleanLocalStorageRadio(): void {
  //   localStorage.setItem("radio", '')
  // }

  setRadioObjShared(data) {

    // if (!data) {
    //   // this.cleanLocalStorageRadio()
    //   this.mountRadioEmptyObj()
    //   return
    // }

    // var newRadioObj = this.mountRadioObj(data)
    this.mountRadioObj(data)

    // localStorage.setItem("radio", JSON.stringify(newRadioObj))
    // this.storedRadioObj = newRadioObj

    // this.setSharedObj(newRadioObj)
    this.setSharedObj()

    // console.log(this.radioObj.value)
  }

  setSharedObj() {

    var utils = new UtilsService()

    this.radioObj.value.freq = this.storedRadioObj.freq !== null ? utils.formatFrequency(this.storedRadioObj.freq) : 0
    this.radioObj.value.mode = this.storedRadioObj.mode
    this.radioObj.value.tx = this.storedRadioObj.tx
    this.radioObj.value.rx = this.storedRadioObj.rx
    this.radioObj.value.fwd_watts = this.storedRadioObj.fwd_watts
    this.radioObj.value.swr = this.storedRadioObj.swr
    this.radioObj.value.ptt = this.storedRadioObj.ptt

    this.radioObj.next(this.radioObj.value)
  }

  mountRadioObj(newObj) {

    // var oldObj: Radio
    // oldObj = this.getLocalStorageRadio()
    // oldObj = this.storedRadioObj

    // var newRadioObj: Radio

    // newRadioObj = {
    //   'type': newObj.type,
    //   'freq': newObj.freq == null ? this.storedRadioObj.freq : newObj.freq,
    //   'mode': newObj.mode == null ? this.storedRadioObj.mode : newObj.mode,
    //   'protection': newObj.protection == null ? this.storedRadioObj.protection : newObj.protection,
    //   'tx': newObj.tx == null ? this.storedRadioObj.tx : newObj.tx,
    //   'rx': newObj.rx == null ? this.storedRadioObj.rx : newObj.rx,
    //   'led': newObj.led == null ? this.storedRadioObj.led : newObj.led,
    //   'fwd_raw': newObj.fwd_raw == null ? this.storedRadioObj.fwd_raw : newObj.fwd_raw,
    //   'fwd_watts': newObj.fwd_watts == null ? this.storedRadioObj.fwd_watts : newObj.fwd_watts,
    //   'swr': newObj.swr == null ? this.storedRadioObj.swr : newObj.swr,
    //   'ref_raw': newObj.ref_raw == null ? this.storedRadioObj.ref_raw : newObj.ref_raw,
    //   'ref_watts': newObj.ref_watts == null ? this.storedRadioObj.ref_watts : newObj.ref_watts,
    //   'connection': newObj.connection == null ? this.storedRadioObj.connection : newObj.connection,
    //   'ptt': newObj.ptt == null ? this.storedRadioObj.ptt : newObj.ptt,
    //   'step': newObj.step == null ? this.storedRadioObj.step : newObj.step
    // }

    // if (!this.storedRadioObj || !this.storedRadioObj.freq) {
    //   this.mountRadioEmptyObj()
    // }

    // this.storedRadioObj.type = newObj.type
    this.storedRadioObj.freq = newObj.freq == null ? this.storedRadioObj.freq : newObj.freq
    this.storedRadioObj.mode = newObj.mode == null ? this.storedRadioObj.mode : newObj.mode
    this.storedRadioObj.protection = newObj.protection == null ? this.storedRadioObj.protection : newObj.protection
    this.storedRadioObj.tx = newObj.tx == null ? this.storedRadioObj.tx : newObj.tx
    this.storedRadioObj.rx = newObj.rx == null ? this.storedRadioObj.rx : newObj.rx
    this.storedRadioObj.led = newObj.led == null ? this.storedRadioObj.led : newObj.led
    this.storedRadioObj.fwd_raw = newObj.fwd_raw == null ? this.storedRadioObj.fwd_raw : newObj.fwd_raw
    this.storedRadioObj.fwd_watts = newObj.fwd_watts == null ? this.storedRadioObj.fwd_watts : newObj.fwd_watts
    this.storedRadioObj.swr = newObj.swr == null ? this.storedRadioObj.swr : newObj.swr
    this.storedRadioObj.ref_raw = newObj.ref_raw == null ? this.storedRadioObj.ref_raw : newObj.ref_raw
    this.storedRadioObj.ref_watts = newObj.ref_watts == null ? this.storedRadioObj.ref_watts : newObj.ref_watts
    this.storedRadioObj.connection = newObj.connection == null ? this.storedRadioObj.connection : newObj.connection
    this.storedRadioObj.ptt = newObj.ptt == null ? this.storedRadioObj.ptt : newObj.ptt
    this.storedRadioObj.step = newObj.step == null ? this.storedRadioObj.step : newObj.step

    // return newRadioObj

  }

  // mountRadioEmptyObj() {

  //   // var emptyRadio: Radio
  //   // this.storedRadioObj.type = null
  //   this.storedRadioObj.freq = null
  //   this.storedRadioObj.mode = null
  //   this.storedRadioObj.protection = null
  //   this.storedRadioObj.tx = null
  //   this.storedRadioObj.rx = null
  //   this.storedRadioObj.led = null
  //   this.storedRadioObj.fwd_raw = null
  //   this.storedRadioObj.fwd_watts = null
  //   this.storedRadioObj.swr = null
  //   this.storedRadioObj.ref_raw = null
  //   this.storedRadioObj.ref_watts = null
  //   this.storedRadioObj.connection = null
  //   this.storedRadioObj.ptt = null
  //   this.storedRadioObj.step = null

  //   // this.storedRadioObj = {
  //   //   'type': null,
  //   //   'freq': null,
  //   //   'mode': null,
  //   //   'protection': null,
  //   //   'tx': null,
  //   //   'rx': null,
  //   //   'led': null,
  //   //   'fwd_raw': null,
  //   //   'fwd_watts': null,
  //   //   'swr': null,
  //   //   'ref_raw': null,
  //   //   'ref_watts': null,
  //   //   'connection': null,
  //   //   'ptt': null,
  //   //   'step': null
  //   // }

  //   // return emptyRadio 
  // }
}
