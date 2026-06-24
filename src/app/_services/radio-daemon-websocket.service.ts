import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { GlobalConstants } from '../global-constants';
import { RadioDaemonHello, RadioDaemonMessage, RadioDaemonState } from '../interfaces/radio-daemon';
import { SharedService } from './shared.service';
import { Radio } from '../interfaces/radio';

@Injectable({
  providedIn: 'root'
})
export class RadioDaemonWebsocketService {
  public state$ = new BehaviorSubject<RadioDaemonState | null>(null);
  public hello$ = new BehaviorSubject<RadioDaemonHello | null>(null);
  public connected$ = new BehaviorSubject<boolean>(false);

  /** Emits FFT spectrum data as a Uint8Array of power bins received from the daemon */
  public spectrum$ = new BehaviorSubject<Uint8Array>(new Uint8Array(0));

  /** Which connection URL is currently selected — true = primary, false = alternate */
  public usePrimaryUrl$ = new BehaviorSubject<boolean>(true);

  private ws: WebSocket | null = null;
  private messagesSubscription: Subscription | null = null;
  private keepAliveSubscription: Subscription | null = null;
  private readonly keepAliveInterval = interval(9000);

  constructor(private sharedService: SharedService) { }

  startService(): void {
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

  private createConnection(): void {
    if (this.ws) {
      try { this.ws.close(); } catch (_) { }
    }

    this.ws = new WebSocket(this.currentUrl);

    this.ws.onopen = () => {
      console.log('Radio daemon websocket connected.');
      this.connected$.next(true);
      this.sharedService.daemonActive$.next(true);
      this.stopKeepAlive();
    };

    this.ws.onmessage = (event: MessageEvent) => {
      if (event.data instanceof ArrayBuffer) {
        const bytes = new Uint8Array(event.data);
        if (bytes.length > 1) {
          // First byte is a type tag (reserved), remainder is FFT power bins
          this.spectrum$.next(bytes.slice(1));
        }
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

    this.ws.onerror = () => {
      console.warn('Radio daemon websocket error, scheduling reconnect...');
      this.connected$.next(false);
      this.sharedService.daemonActive$.next(false);
      this.keepWebSocketAlive();
    };

    this.ws.onclose = () => {
      console.log('Radio daemon websocket closed.');
      this.connected$.next(false);
      this.sharedService.daemonActive$.next(false);
      this.keepWebSocketAlive();
    };
  }

  /**
   * Maps a RadioDaemonState message into the shared Radio object
   * and pushes it to SharedService so the entire app receives the data
   * from whichever daemon connection is selected.
   */
  private feedSharedService(state: RadioDaemonState): void {
    const radio: Radio = {
      p0_freq: state.frequency ? String(state.frequency) : '0',
      p1_freq: state.frequency ? String(state.frequency) : '0',
      p0_mode: state.mode ?? '',
      p1_mode: state.mode ?? '',
      protection: state.protection ?? false,
      tx: state.tx ?? false,
      rx: !state.tx,
      led: false,
      fwd_raw: state.fwd ?? 0,
      fwd_watts: String(state.fwd ?? 0),
      swr: String(state.swr ?? 10),
      ref_raw: state.ref_power ?? 0,
      ref_watts: state.ref_power ?? 0,
      connection: state.system_is_connected ?? false,
      ptt: state.tx ?? false,
      step: state.step_size ?? 0,
      p0_volume: 0,
      p1_volume: 0,
      profile: state.profile ?? 0,
      p1_freq_splited: null,
      timeout_raw: state.timeout ?? 0,
      timeout: String(state.timeout ?? '0'),
      datetime: new Date(),
      snr: String(state.snr ?? '0'),
      snrHistory: [],
      snrLength: 0,
      bitrate: String(state.bitrate ?? '0'),
      bitrateHistory: [],
      bitrateLength: 0,
      bytes_received: state.bytes_received ?? 0,
      bytes_transmitted: state.bytes_transmitted ?? 0,
      message: '',
      p0_digital_voice: state.digital_voice ?? false,
      p1_digital_voice: state.digital_voice ?? false
    };

    this.sharedService.setRadioObjShared(radio);
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

    if (this.ws) {
      try { this.ws.close(); } catch (_) { }
      this.ws = null;
    }

    this.connected$.next(false);
  }
}
