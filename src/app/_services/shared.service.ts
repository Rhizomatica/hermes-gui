import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Radio } from '../interfaces/radio';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  public radioObj = new BehaviorSubject<Radio>({
    type: null,
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
}