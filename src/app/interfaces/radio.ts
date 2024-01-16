export interface Radio {
  freq: number,
  digital_frequency: number,
  analog_frequency: number,
  analog_mode: string, //0 - fonia
  digital_mode: string, //1
  protection: boolean,
  tx: boolean,
  rx: boolean,
  led: boolean,
  fwd_raw: number,
  fwd_watts: string,
  swr: string,
  ref_raw: number,
  ref_watts: number,
  connection: boolean,
  ptt: boolean,
  step: number,
  volume: number,
  profile_active_idx: number
}