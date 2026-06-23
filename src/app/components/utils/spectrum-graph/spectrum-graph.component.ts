import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { RadioDaemonWebsocketService } from 'src/app/_services/radio-daemon-websocket.service';

@Component({
  selector: 'app-spectrum-graph',
  templateUrl: './spectrum-graph.component.html',
  styleUrls: ['./spectrum-graph.component.less']
})
export class SpectrumGraphComponent implements OnInit, OnDestroy {
  @Input() binCount = 256;
  @Input() historyRows = 128;
  @Input() maxDb = 0;
  @Input() minDb = -120;

  @ViewChild('waterfallCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D | null;
  private waterfall: ImageData[] = [];
  private spectrumSubscription!: Subscription;
  private colormap: Uint8ClampedArray;

  constructor(private daemonService: RadioDaemonWebsocketService) {
    // Precompute a 256-entry colormap (blue → cyan → yellow → red)
    this.colormap = new Uint8ClampedArray(256 * 4);
    for (let i = 0; i < 256; i++) {
      const t = i / 255;
      const r = t < 0.5 ? 0 : (t - 0.5) * 2 * 255;
      const g = t < 0.25 ? t * 4 * 255 : t < 0.75 ? 255 : (1 - t) * 4 * 255;
      const b = t > 0.5 ? 0 : (0.5 - t) * 2 * 255;
      this.colormap[i * 4] = r;
      this.colormap[i * 4 + 1] = g;
      this.colormap[i * 4 + 2] = b;
      this.colormap[i * 4 + 3] = 255;
    }
  }

  ngOnInit(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.binCount;
    canvas.height = this.historyRows;
    this.ctx = canvas.getContext('2d');

    // Listen for new FFT frames from the daemon
    this.spectrumSubscription = this.daemonService.spectrum$.subscribe(bins => {
      if (bins.length === 0) return;
      this.addRow(bins);
    });
  }

  private addRow(bins: Uint8Array): void {
    if (!this.ctx) return;

    // Create a row of pixels mapped from the FFT bins
    const rowData = new Uint8ClampedArray(this.binCount * 4);
    const range = this.maxDb - this.minDb;

    for (let x = 0; x < this.binCount; x++) {
      // Resample bins to fit the canvas width
      const srcIdx = Math.floor((x / this.binCount) * bins.length);
      const raw = bins[srcIdx] ?? 0;

      // Map raw Uint8 [0,255] to dB range and then to colormap index [0,255]
      const dB = this.minDb + (raw / 255) * range;
      const normalized = Math.max(0, Math.min(255, ((dB - this.minDb) / range) * 255));
      const idx = Math.floor(normalized);

      rowData[x * 4] = this.colormap[idx * 4];
      rowData[x * 4 + 1] = this.colormap[idx * 4 + 1];
      rowData[x * 4 + 2] = this.colormap[idx * 4 + 2];
      rowData[x * 4 + 3] = 255;
    }

    const row = new ImageData(rowData, this.binCount, 1);

    // Shift existing waterfall upward (newest row at bottom)
    if (this.waterfall.length >= this.historyRows) {
      this.waterfall.shift();
    }
    this.waterfall.push(row);

    // Redraw the entire canvas
    for (let y = 0; y < this.waterfall.length; y++) {
      this.ctx.putImageData(this.waterfall[y], 0, this.historyRows - 1 - y);
    }
  }

  ngOnDestroy(): void {
    this.spectrumSubscription?.unsubscribe();
  }
}
