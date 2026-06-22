export interface RadioDaemonHello {
  type: 'hello';
  api: string;
  audio_binary_type: number;
  rx_spectrum_binary_type: number;
  tx_spectrum_binary_type: number;
}

export interface RadioDaemonState {
  type: 'state';
  profile: number;
  frequency: number;
  freq: number;
  mode: string;
  tx: boolean;
  txrx_state: number;
  bitrate: number;
  snr: number;
  bytes_transmitted: number;
  bytes_received: number;
  system_is_connected: boolean;
  system_is_ok: boolean;
  bfo: number;
  serial: number;
  step_size: number;
  tone: boolean;
  reflected_threshold: number;
  timeout: number;
  recording_rx: boolean;
  recording_tx: boolean;
  audio_sample_rate: number;
  message_available: boolean;
  backend: string;
  digital_voice: boolean;
  protection: boolean;
  pipeline: string;
  pipeline_mode: string;
  pipeline_media: string;
  pipeline_runtime: string;
  stream_rx_audio: boolean;
  stream_tx_audio: boolean;
  stream_spectrum: boolean;
  stream_recording: boolean;
  audio_bridge: boolean;
}

export type RadioDaemonMessage = RadioDaemonHello | RadioDaemonState;
