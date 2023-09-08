export interface Radio {
  freq: number,
  mode: string,
  protection: boolean,
  tx: boolean,
  rx: boolean,
  led: boolean,
  fwd_raw: number,
  // fwd_volts: Number,
  fwd_watts: string,
  swr: string,
  ref_raw: number,
  // ref_volts: Number,
  ref_watts: number,
  connection: boolean,
  ptt: boolean,
  step: number
}