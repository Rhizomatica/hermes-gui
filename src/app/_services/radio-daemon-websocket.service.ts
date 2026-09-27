import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { GlobalConstants } from '../global-constants';
import { RadioDaemonHello, RadioDaemonMessage, RadioDaemonState } from '../interfaces/radio-daemon';
import { SharedService } from './shared.service';
import { Radio } from '../interfaces/radio';
import { RadioService } from './radio.service';
import { ApiService } from './api.service';

export interface SpectrumFrame {
  /** Sample rate in Hz */
  sampleRate: number;
  /** Number of FFT bins */
  bins: number;
  /** Hz per bin */
  binHz: number;
  /** Array of dB power values (one per bin) */
  db: Float32Array;
}

@Injectable({
  providedIn: 'root'
})
export class RadioDaemonWebsocketService {
  public state$ = new BehaviorSubject<RadioDaemonState | null>(null);
  public hello$ = new BehaviorSubject<RadioDaemonHello | null>(null);
  public connected$ = new BehaviorSubject<boolean>(false);

  /** Emits parsed spectrum frames from the daemon */
  public spectrum$ = new BehaviorSubject<SpectrumFrame | null>(null);

  /** Which connection URL is currently selected — true = primary, false = alternate */
  public usePrimaryUrl$ = new BehaviorSubject<boolean>(true);

  private ws: WebSocket | null = null;
  private messagesSubscription: Subscription | null = null;
  private keepAliveSubscription: Subscription | null = null;
  private readonly keepAliveInterval = interval(9000);

  /** The daemon reports the active profile only: the other one comes from
   *  the API, when the active profile changes and every 30 s. */
  private activeProfile: number | null = null;
  private refreshSubscription: Subscription | null = null;
  private readonly refreshInterval = interval(30000);

  /** The station's clock, as the API reads it, and when it was read: the
   *  daemon does not send the time the sbitx_controller did (the schedule
   *  page shows it, and the schedules run on it). */
  private stationClockBase: number | null = null;
  private stationClockReadAt = 0;

  constructor(
    private sharedService: SharedService,
    private radioService: RadioService,
    private apiService: ApiService,
    private http: HttpClient
  ) { }

  startService(): void {
    // the app and the home page both start it: one connection is enough
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN))
      return;
    console.log('Starting radio daemon websocket...');
    this.createConnection();
  }

  /**
   * Switch between the primary and alternate websocket URL.
   * Closes the current connection and opens a new one on the chosen endpoint.
   */
  switchConnection(usePrimary: boolean): void {
    const current = this.usePrimaryUrl$.getValue();
    if (current === usePrimary) return;

    this.usePrimaryUrl$.next(usePrimary);

    const url = GlobalConstants.radioDaemonUrl

    console.log(`Radio daemon websocket: switching to ${url}`);

    // Close existing connection and reconnect
    this.closeConnection();
    this.createConnection();
  }

  private get currentUrl(): string {
    return GlobalConstants.radioDaemonUrl
  }

  /** Close a socket so that its late events cannot touch the state of the
   *  connection that replaces it. */
  private dropSocket(ws: WebSocket | null): void {
    if (!ws) return;
    ws.onopen = null;
    ws.onmessage = null;
    ws.onerror = null;
    ws.onclose = null;
    try { ws.close(); } catch (_) { }
  }

  private createConnection(): void {
    this.dropSocket(this.ws);

    const ws = new WebSocket(this.currentUrl);
    ws.binaryType = 'arraybuffer';
    this.ws = ws;

    ws.onopen = () => {
      if (this.ws !== ws) return;
      console.log('Radio daemon websocket connected.');
      this.connected$.next(true);
      this.sharedService.daemonActive$.next(true);
      this.stopKeepAlive();
      this.activeProfile = null;
      this.readStationClock();
      this.startRefresh();
    };

    ws.onmessage = (event: MessageEvent) => {
      if (this.ws !== ws) return;
      if (event.data instanceof ArrayBuffer) {
        this.handleBinary(new Uint8Array(event.data));
        return;
      }
      if (typeof event.data !== 'string') return;
      try {
        const msg: RadioDaemonMessage = JSON.parse(event.data);
        if (msg.type === 'hello') {
          this.hello$.next(msg as RadioDaemonHello);
        } else if (msg.type === 'state') {
          const state = msg as RadioDaemonState;
          this.state$.next(state);
          if (this.sharedService.daemonActive$.getValue()) {
            this.feedSharedService(state);
          }
        }
      } catch (e) {
        console.warn('Radio daemon websocket: failed to parse message', e);
      }
    };

    ws.onerror = () => {
      if (this.ws !== ws) return;
      console.warn('Radio daemon websocket error, scheduling reconnect...');
      this.connected$.next(false);
      this.sharedService.daemonActive$.next(false);
      this.stopRefresh();
      this.keepWebSocketAlive();
    };

    ws.onclose = () => {
      if (this.ws !== ws) return;
      console.log('Radio daemon websocket closed.');
      this.connected$.next(false);
      this.sharedService.daemonActive$.next(false);
      this.stopRefresh();
      this.keepWebSocketAlive();
    };
  }

  /**
   * Parse binary frames from the radio daemon.
   *
   * Frame format (matching hermes-radio-daemon web/index.html):
   *   [opcode: u8][sample_rate: u32 LE][nbins: u16 LE][bin_hz: f32 LE][bins: f32 LE × nbins]
   * Opcode 0x02 = spectrum frame.
   */
  private handleBinary(data: Uint8Array): void {
    if (data.length < 11) return; // need at least opcode + sample_rate(4) + nbins(2) + bin_hz(4) = 11

    const dv = new DataView(data.buffer, data.byteOffset, data.byteLength);
    const opcode = dv.getUint8(0);

    if (opcode === 0x02) {
      const sampleRate = dv.getUint32(1, true);
      const nbins = dv.getUint16(5, true);
      const binHz = dv.getFloat32(7, true);

      const floatCount = (data.length - 11) / 4;
      if (floatCount < nbins || nbins < 1) return;

      const db = new Float32Array(nbins);
      for (let i = 0; i < nbins; i++) {
        db[i] = dv.getFloat32(11 + i * 4, true);
      }

      this.spectrum$.next({ sampleRate, bins: nbins, binHz, db });
    }
  }

  /**
   * Maps a RadioDaemonState message into the shared Radio object.
   *
   * SharedService keeps a field's previous value when the new one is null
   * or undefined, so only what the daemon actually reports is set here:
   * the active profile's frequency, mode and digital voice (the other
   * profile's come from the API), and nothing for the fields the daemon
   * does not have (led) or did not send.
   */
  private feedSharedService(state: RadioDaemonState): void {
    const profile = state.profile ?? 0;
    const radio: Partial<Radio> = {
      protection: state.protection,
      tx: state.tx,
      rx: state.tx == null ? undefined : !state.tx,
      fwd_raw: state.fwd,
      fwd_watts: state.fwd == null ? undefined : String(state.fwd),
      swr: state.swr == null ? undefined : String(state.swr),
      ref_raw: state.ref_power,
      ref_watts: state.ref_power,
      connection: state.system_is_connected,
      ptt: state.tx,
      step: state.step_size,
      profile: profile,
      timeout_raw: state.timeout,
      timeout: state.timeout == null ? undefined : String(state.timeout),
      datetime: this.stationClock() as any,
      snr: state.snr == null ? undefined : String(state.snr),
      bitrate: state.bitrate == null ? undefined : String(state.bitrate),
      bytes_received: state.bytes_received,
      bytes_transmitted: state.bytes_transmitted,
      message: state.message,
      s_meter: state.s_meter
    };

    const freq = state.frequency == null ? undefined : String(state.frequency);
    if (profile === 0) {
      radio.p0_freq = freq;
      radio.p0_mode = state.mode;
      radio.p0_digital_voice = state.digital_voice;
    } else {
      radio.p1_freq = freq;
      radio.p1_mode = state.mode;
      radio.p1_digital_voice = state.digital_voice;
    }

    this.sharedService.setRadioObjShared(radio as Radio);

    if (this.activeProfile !== profile) {
      this.activeProfile = profile;
      this.refreshInactiveProfile();
    }
  }

  /** The profile the daemon is not reporting, from the API. */
  private refreshInactiveProfile(): void {
    if (this.activeProfile === null) return;
    const other = this.activeProfile === 0 ? 1 : 0;

    this.radioService.getRadioStatus(other).subscribe({
      next: (res: any) => {
        if (!res || this.activeProfile === other) return;
        const radio: Partial<Radio> = other === 0
          ? { p0_freq: res.freq, p0_mode: res.mode }
          : { p1_freq: res.freq, p1_mode: res.mode };
        this.sharedService.setRadioObjShared(radio as Radio);
      },
      error: () => { }
    });

    // the voice profile's digital voice (the API only has it for profile 1)
    if (other === 1) {
      this.http.get(`${GlobalConstants.apiURL}/radio/voice/digital`, { responseType: 'text' }).subscribe({
        next: (res: string) => {
          if (this.activeProfile === 1 || (res !== 'ON' && res !== 'OFF')) return;
          this.sharedService.setRadioObjShared({ p1_digital_voice: res === 'ON' } as Radio);
        },
        error: () => { }
      });
    }
  }

  /** Read the station's clock ("dd/mm/yyyy hh:mm:ss", as the API gives it). */
  private readStationClock(): void {
    this.apiService.getStatus().subscribe({
      next: (res: any) => {
        const m = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})$/.exec(res?.datetime ?? '');
        if (!m) return;
        this.stationClockBase = Date.UTC(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +m[6]);
        this.stationClockReadAt = Date.now();
      },
      error: () => { }
    });
  }

  /** The station's clock now, formatted as the sbitx_controller sent it;
   *  undefined until it has been read (the previous value stays). */
  private stationClock(): string | undefined {
    if (this.stationClockBase === null) return undefined;
    const t = new Date(this.stationClockBase + (Date.now() - this.stationClockReadAt));
    const two = (n: number) => String(n).padStart(2, '0');
    return `${two(t.getUTCDate())}/${two(t.getUTCMonth() + 1)}/${t.getUTCFullYear()} ` +
      `${two(t.getUTCHours())}:${two(t.getUTCMinutes())}:${two(t.getUTCSeconds())}`;
  }

  private startRefresh(): void {
    this.stopRefresh();
    this.refreshSubscription = this.refreshInterval.subscribe(() => {
      this.refreshInactiveProfile();
      this.readStationClock();
    });
  }

  private stopRefresh(): void {
    if (this.refreshSubscription && !this.refreshSubscription.closed) {
      this.refreshSubscription.unsubscribe();
    }
    this.refreshSubscription = null;
  }

  private keepWebSocketAlive(): void {
    if (this.keepAliveSubscription && !this.keepAliveSubscription.closed) return;

    this.keepAliveSubscription = this.keepAliveInterval.subscribe(() => {
      console.log('Radio daemon websocket keep-alive: attempting reconnect...');
      this.createConnection();
    });
  }

  private stopKeepAlive(): void {
    if (this.keepAliveSubscription && !this.keepAliveSubscription.closed) {
      this.keepAliveSubscription.unsubscribe();
      this.keepAliveSubscription = null;
    }
  }

  closeConnection(): void {
    this.stopKeepAlive();
    this.stopRefresh();
    this.dropSocket(this.ws);
    this.ws = null;
    this.connected$.next(false);
    this.sharedService.daemonActive$.next(false);
  }
}
