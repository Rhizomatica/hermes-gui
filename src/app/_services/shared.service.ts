import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {

  public radioObj = new BehaviorSubject<any>({
    type: null,
    frequency: null,
    irxs: null,
    freq: null,
    mode: null,
    protection: null,
    tx: null,
    rx: null,
    led: null,
    fwd_raw: null,
    fwd_volts: null,
    fwd_watts: null,
    swr: null,
    ref_raw: null,
    ref_volts: null,
    ref_watts: null,
    connection: null
  });
}