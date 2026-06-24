import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RadioDaemonWebsocketService, SpectrumFrame } from 'src/app/_services/radio-daemon-websocket.service';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-spectrum-graph',
  templateUrl: './spectrum-graph.component.html',
  styleUrls: ['./spectrum-graph.component.less']
})
export class SpectrumGraphComponent implements OnInit, OnDestroy {

  @ViewChild('scopeCanvas', { static: true }) scopeRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('wfCanvas', { static: true }) wfRef!: ElementRef<HTMLCanvasElement>;

  private scopeCtx!: CanvasRenderingContext2D;
  private wfCtx!: CanvasRenderingContext2D;

  private spectrumSubscription!: Subscription;
  private stateSubscription!: Subscription;
  private pendingFrame: SpectrumFrame | null = null;
  private rafId: number | null = null;

  /** Live calibration — adjustable from template */
  floor = -90;
  ceiling = -20;
  palette = 'turbo';
  speed = 1;

  /** RF display info (updated from daemon state) */
  freqHz = 0;
  mode = '';

  constructor(
    private daemonService: RadioDaemonWebsocketService,
    private sharedService: SharedService
  ) { }

  ngOnInit(): void {
    const scopeCanvas = this.scopeRef.nativeElement;
    const wfCanvas = this.wfRef.nativeElement;

    this.scopeCtx = scopeCanvas.getContext('2d')!;
    this.wfCtx = wfCanvas.getContext('2d')!;

    // Start black
    this.wfCtx.fillStyle = '#000';
    this.wfCtx.fillRect(0, 0, wfCanvas.width, wfCanvas.height);

    // Incoming spectrum frames
    this.spectrumSubscription = this.daemonService.spectrum$.subscribe(frame => {
      if (!frame) return;
      this.pendingFrame = frame;
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => this.renderPending());
      }
    });

    // Track RF frequency & mode for axis labels
    this.stateSubscription = this.daemonService.state$.subscribe(state => {
      if (!state) return;
      this.freqHz = state.frequency ?? state.freq ?? this.freqHz;
      this.mode = state.mode ?? this.mode;
    });
  }

  private renderPending(): void {
    this.rafId = null;
    if (this.pendingFrame) {
      this.drawSpectrum(this.pendingFrame);
      this.pendingFrame = null;
    }
  }

  private drawSpectrum(frame: SpectrumFrame): void {
    const { bins, binHz, db } = frame;
    if (bins < 1) return;

    const span = this.ceiling - this.floor;
    if (span < 1) return;

    // ---- Resize canvases if needed ----
    const scopeCanvas = this.scopeCtx.canvas;
    if (scopeCanvas.width !== bins) { scopeCanvas.width = bins; scopeCanvas.height = 90; }
    const wfCanvas = this.wfCtx.canvas;
    if (wfCanvas.width !== bins) {
      // Only reset when width changes
      const oldW = wfCanvas.width;
      wfCanvas.width = bins;
      wfCanvas.height = 170;
      if (oldW !== bins) {
        this.wfCtx.fillStyle = '#000';
        this.wfCtx.fillRect(0, 0, wfCanvas.width, wfCanvas.height);
      }
    }

    // ---- Spectrum scope (top) ----
    const sc = this.scopeCtx;
    sc.clearRect(0, 0, scopeCanvas.width, scopeCanvas.height);

    // Frequency grid lines (at 1/4 marks)
    sc.strokeStyle = 'rgba(90,90,90,0.35)';
    sc.lineWidth = 1;
    for (let g = 1; g < 4; g++) {
      const gx = Math.floor(bins * g / 4);
      sc.beginPath(); sc.moveTo(gx, 0); sc.lineTo(gx, scopeCanvas.height); sc.stroke();
    }

    // Filled amplitude trace
    sc.beginPath();
    sc.moveTo(0, scopeCanvas.height);
    for (let i = 0; i < bins; i++) {
      const t = Math.max(0, Math.min(1, (db[i] - this.floor) / span));
      sc.lineTo(i, scopeCanvas.height - t * scopeCanvas.height);
    }
    sc.lineTo(bins - 1, scopeCanvas.height);
    sc.closePath();
    sc.fillStyle = 'rgba(0,210,130,0.30)';
    sc.fill();
    sc.strokeStyle = '#2fe88a';
    sc.lineWidth = 1;
    sc.stroke();

    // ---- Waterfall (bottom) ----
    const wf = this.wfCtx;
    const rows = this.speed;
    // Shift down by 'rows' pixels
    wf.drawImage(wfCanvas, 0, rows);
    // Draw new line(s) at top
    for (let i = 0; i < bins; i++) {
      const t = Math.max(0, Math.min(1, (db[i] - this.floor) / span));
      wf.fillStyle = this.wfColor(t);
      wf.fillRect(i, 0, 1, rows);
    }
  }

  /**
   * Colormap matching hermes-radio-daemon reference:
   * HSL sweep: blue (240°) → cyan → green → yellow → red (0°)
   * turbo palette (default)
   */
  private wfColor(t: number): string {
    if (t < 0) t = 0; if (t > 1) t = 1;
    if (this.palette === 'grey') {
      const v = Math.round(t * 255);
      return `rgb(${v},${v},${v})`;
    }
    if (this.palette === 'green') {
      return `hsl(120,100%,${Math.round(t * 60)}%)`;
    }
    // turbo: blue → cyan → green → yellow → red
    const hue = Math.round((1 - t) * 240);
    const l = Math.round(8 + t * 47);
    return `hsl(${hue},100%,${l}%)`;
  }

  ngOnDestroy(): void {
    this.spectrumSubscription?.unsubscribe();
    this.stateSubscription?.unsubscribe();
  }
}
