export interface Radio {
  type: String,
  irxs: Number,
  freq: Number,
  mode: String,
  protection: String,
  tx: Boolean,
  rx: Boolean,
  led: Boolean,
  fwd_raw: Number,
  fwd_volts: Number,
  fwd_watts: Number,
  swr: Number,
  ref_raw: Number,
  ref_volts: Number,
  ref_watts: Number,
  connection: Boolean
}