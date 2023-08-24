export interface Radio {
  freq: number,
  mode: string,
  protection: string,
  tx: Boolean,
  rx: Boolean,
  led: Boolean,
  fwd_raw: number,
  // fwd_volts: Number,
  fwd_watts: string,
  swr: string,
  ref_raw: number,
  // ref_volts: Number,
  ref_watts: number,
  connection: Boolean,
  ptt: Boolean,
  step: number
}