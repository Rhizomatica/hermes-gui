export interface Radio {
  p0_freq: number,
  p1_freq: number,
  p0_mode: string,
  p1_mode: string,
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
  p0_volume: number,
  p1_volume: number,
  profile: number,
  p1_freq_splited: Array<string>,
  timeout: string,
  datetime: Date,
  snr: string,
  snrHistory: Array<object>
  snrLength: number,
  bitrate: string,
  bitrateHistory: Array<object>,
  bitrateLength: number
}