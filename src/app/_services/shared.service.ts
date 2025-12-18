import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Radio } from '../interfaces/radio';
import { UtilsService } from './utils.service';
import { Router } from '@angular/router';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  constructor(private router: Router) { }
  utils = new UtilsService()

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
    timeout: null,
    datetime: null,
    snr: null,
    snrHistory: null,
    snrLength: null,
    bitrate: null,
    bitrateHistory: null,
    bitrateLength: null,
    bytes_received: null,
    bytes_transmitted: null,
    message: null,
    digital: null
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
    timeout: null,
    datetime: null,
    snr: null,
    snrHistory: [],
    snrLength: null,
    bitrate: null,
    bitrateHistory: [],
    bitrateLength: null,
    bytes_received: null,
    bytes_transmitted: null,
    message: null,
    digital: null
  });

  setRadioObjShared(data) {
    this.mountRadioObj(data)
    this.setSharedObj()
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
    this.radioObj.value.timeout = this.storedRadioObj.timeout
    this.radioObj.value.datetime = this.storedRadioObj.datetime
    this.radioObj.value.snr = this.storedRadioObj.snr
    this.radioObj.value.snrHistory = this.storedRadioObj.snrHistory
    this.radioObj.value.snrLength = this.storedRadioObj.snrLength
    this.radioObj.value.bitrate = this.storedRadioObj.bitrate
    this.radioObj.value.bitrateHistory = this.storedRadioObj.bitrateHistory
    this.radioObj.value.bitrateLength = this.storedRadioObj.bitrateLength
    this.radioObj.value.bitrateLength = this.storedRadioObj.bitrateLength
    this.radioObj.value.bytes_received = this.storedRadioObj.bytes_received
    this.radioObj.value.bytes_transmitted = this.storedRadioObj.bytes_transmitted
    this.radioObj.value.message = this.storedRadioObj.message
    this.radioObj.value.digital = this.storedRadioObj.digital
    this.radioObj.next(this.radioObj.value)
  }

  mountRadioObj(newObj) {

    this.storedRadioObj.connection = newObj.connection == null ? this.storedRadioObj.connection : newObj.connection
    this.storedRadioObj.led = newObj.led == null ? this.storedRadioObj.led : newObj.led
    this.storedRadioObj.p0_freq = newObj.p0_freq == null ? this.storedRadioObj.p0_freq : this.utils.formatFrequency(newObj.p0_freq)
    this.storedRadioObj.p1_freq = newObj.p1_freq == null ? this.storedRadioObj.p1_freq : this.utils.formatFrequency(newObj.p1_freq)
    this.storedRadioObj.p0_mode = newObj.p0_mode == null ? this.storedRadioObj.p0_mode : newObj.p0_mode
    this.storedRadioObj.p1_mode = newObj.p1_mode == null ? this.storedRadioObj.p1_mode : newObj.p1_mode
    this.storedRadioObj.tx = newObj.tx == null ? this.storedRadioObj.tx : newObj.tx
    this.storedRadioObj.rx = newObj.rx == null ? this.storedRadioObj.rx : newObj.rx
    this.storedRadioObj.fwd_watts = newObj.fwd_watts == null ? this.storedRadioObj.fwd_watts : this.utils.formatPower(newObj.fwd_watts)
    this.storedRadioObj.swr = newObj.swr == null ? this.storedRadioObj.swr : this.utils.formatSWR(newObj.swr)
    this.storedRadioObj.protection = newObj.protection == null ? this.storedRadioObj.protection : newObj.protection
    this.storedRadioObj.p1_volume = newObj.p1_volume == null ? this.storedRadioObj.p1_volume : newObj.p1_volume

    this.observeOperatingProfileMode(newObj.profile)

    this.storedRadioObj.profile = newObj.profile == null ? this.storedRadioObj.profile : newObj.profile
    this.storedRadioObj.ptt = newObj.ptt == null ? this.storedRadioObj.ptt : newObj.ptt
    this.storedRadioObj.p1_freq_splited = this.utils.splitFrequency(this.storedRadioObj.p1_freq)
    this.storedRadioObj.timeout = newObj.timeout == null ? this.storedRadioObj.timeout : this.utils.formatTimeCounter(newObj.timeout)
    this.storedRadioObj.datetime = newObj.datetime == null ? this.storedRadioObj.datetime : newObj.datetime
    this.storedRadioObj.snr = newObj.snr == null ? this.storedRadioObj.snr : this.utils.formatDecimal(newObj.snr)
    this.prepareSNRHistory()
    this.storedRadioObj.snrLength = this.storedRadioObj.snrHistory.length
    this.storedRadioObj.bitrate = newObj.bitrate == null ? this.storedRadioObj.bitrate : newObj.bitrate
    this.prepareBitrateHistory()
    this.storedRadioObj.bitrateLength = this.storedRadioObj.bitrateHistory.length
    this.storedRadioObj.bytes_received = newObj.bytes_received == null ? this.storedRadioObj.bytes_received : newObj.bytes_received
    this.storedRadioObj.bytes_transmitted = newObj.bytes_transmitted == null ? this.storedRadioObj.bytes_transmitted : newObj.bytes_transmitted
    this.storedRadioObj.message = newObj.message == null ? this.storedRadioObj.message : newObj.message
    this.storedRadioObj.digital = newObj.digital == null ? this.storedRadioObj.digital : newObj.digital

  }

  mountRadioObjDemo() {

    this.radioObj.value.connection = false
    this.radioObj.value.led = false
    this.radioObj.value.p0_freq = this.utils.formatFrequency(1085500)
    this.radioObj.value.p1_freq = this.utils.formatFrequency(1075000)
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
    this.radioObj.value.p1_freq_splited = this.utils.splitFrequency(this.radioObj.value.p1_freq)
    this.radioObj.value.timeout = this.utils.formatTimeCounter('300')
    this.radioObj.value.datetime = new Date('08/04/2024 13:03:01')
    this.radioObj.value.snr = 15.3
    this.radioObj.value.bitrate = '363'
    this.radioObj.value.bytes_received = 12
    this.radioObj.value.bytes_transmitted = 5
    this.radioObj.value.message = 'This is a demo version' 
    this.radioObj.value.digital = false
    this.radioObj.next(this.radioObj.value)
  }

  observeOperatingProfileMode(newProfile) {
    //kick user from voice screen if new profile is data
    if (GlobalConstants.bitx == 'S' && this.utils.isItRuningLocal() && this.storedRadioObj.profile == 1 && newProfile == 0 && this.router.url == '/voice') {
      this.router.navigate(['/home']);
    }
  }

  prepareBitrateHistory() {

    if (!this.storedRadioObj.bitrate || this.storedRadioObj.bitrate == '0')
      return

    var bitrateData = new Object()
    var today = new Date();
    var year = today.getFullYear()
    var month = today.getMonth()
    var day = today.getDay()
    var hour = today.getHours()
    var minute = today.getMinutes()
    var second = today.getSeconds()

    bitrateData = {
      date: new Date(year, month, day, hour, minute, second),
      value: this.storedRadioObj.bitrate
    }

    this.storedRadioObj.bitrateHistory.push(bitrateData)

    if (this.storedRadioObj.bitrateHistory.length > 10000) {
      this.storedRadioObj.bitrateHistory.shift()
      this.storedRadioObj.bitrateHistory.shift()
    }
  }

  prepareSNRHistory() {
    
    if (!this.storedRadioObj.snr || this.storedRadioObj.snr == 0)
      return

    var snrData = new Object()
    var today = new Date();
    var year = today.getFullYear()
    var month = today.getMonth()
    var day = today.getDay()
    var hour = today.getHours()
    var minute = today.getMinutes()
    var second = today.getSeconds()

    snrData = {
      date: new Date(year, month, day, hour, minute, second),
      value: this.storedRadioObj.snr
    }

    this.storedRadioObj.snrHistory.push(snrData)
    
    if (this.storedRadioObj.snrHistory.length > 10000) {
      this.storedRadioObj.snrHistory.shift()
      this.storedRadioObj.snrHistory.shift()
    }
  }
}
