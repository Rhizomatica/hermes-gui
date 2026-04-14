import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, interval, lastValueFrom } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { GlobalConstants } from 'src/app/global-constants';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GPSService } from '../../../_services/gps.service';

@Component({
  selector: 'gps',
  templateUrl: './gps.component.html',
  styleUrls: ['./gps.component.less']
})
export class GPSComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  admin = false;

  error: unknown = null;
  errorAlert = false;
  loading = false;

  files: string[] = [];
  intervalValue = 0;
  range = 0;
  email: string | null = null;

  currentLatitude: number | null = null;
  currentLongitude: number | null = null;

  status = false;

  urlDownloadFile = `${GlobalConstants.apiURL}/geolocation/file`;
  urlDownloadAll = `${GlobalConstants.apiURL}/geolocation/files/all`;

  deleteConfirmation = false;
  confirmSOS = false;

  private readonly destroy$ = new Subject<void>();
  isArabic: boolean = GlobalConstants.localeId == 'ar' ? true : false


  constructor(
    private authenticationService: AuthenticationService,
    private gpsService: GPSService
  ) {
    this.authenticationService.currentUser
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => {
        this.currentUser = x;
        this.admin = !!x?.admin;
      });
  }

  private handleError(err: unknown): void {
    this.error = err;
    this.errorAlert = true;
  }

  private isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((item) => typeof item === 'string');
  }

  private isCoordinates(
    value: unknown
  ): value is { latitude: number | string | null; longitude: number | string | null } {
    return (
      typeof value === 'object' &&
      value !== null &&
      'latitude' in value &&
      'longitude' in value
    );
  }

  async getGPSFiles(): Promise<void> {
    try {
      const res = await lastValueFrom(this.gpsService.getStoredGPSFiles());
      if (this.isStringArray(res)) this.files = res;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getGPSStatus(): Promise<void> {
    try {
      const res = await lastValueFrom(this.gpsService.getGPSStatus());
      if (typeof res === 'boolean') this.status = res;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getInterval(): Promise<void> {
    try {
      const res = await lastValueFrom(this.gpsService.getInterval());
      if (res != null) this.intervalValue = Number(res);
    } catch (err) {
      this.handleError(err);
    }
  }

  async getFileRangeTime(): Promise<void> {
    try {
      const res = await lastValueFrom(this.gpsService.getFileRangeTime());
      if (res != null) this.range = Number(res) / 60;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getEmail(): Promise<void> {
    try {
      const res = await lastValueFrom(this.gpsService.getEmail());
      if (typeof res === 'string') this.email = res;
    } catch (err) {
      this.handleError(err);
    }
  }

  async getCurrentCoordinates(): Promise<void> {
    try {
      const res = await lastValueFrom(this.gpsService.getCurrentCoordinates());
      if (this.isCoordinates(res) && res.latitude !== null && res.longitude !== null) {
        this.currentLatitude = Number(res.latitude);
        this.currentLongitude = Number(res.longitude);
      }
    } catch (err) {
      return
    }
  }

  updateGPSInterval(f: NgForm): void {
    this.loading = true;
    this.gpsService.updateGPSInterval(f.value.interval)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        error: (err) => this.handleError(err)
      });
  }

  updateFileRangeTime(f: NgForm): void {
    this.loading = true;
    const rangeInSeconds = f.value.range ? Number(f.value.range) * 60 : f.value.range;

    this.gpsService.updateFileRangeTime(rangeInSeconds)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        error: (err) => this.handleError(err)
      });
  }

  updateGPSEmail(f: NgForm): void {
    this.loading = true;
    this.gpsService.updateGPSEmail(f.value.email)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        error: (err) => this.handleError(err)
      });
  }

  toggleGPS(): void {
    const nextStatus = !this.status;
    this.status = nextStatus;
    this.loading = true;

    this.gpsService.toggleGPS(nextStatus)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        error: (err) => {
          this.status = !nextStatus;
          this.handleError(err);
        }
      });
  }

  deleteAllStoredFiles(): void {
    this.deleteConfirmation = !this.deleteConfirmation;
  }

  confirmDeleteAllStoredFiles(): void {
    this.deleteConfirmation = false;
    this.loading = true;

    this.gpsService.deleteAllStoredFiles()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          void this.getGPSFiles();
        },
        error: (err) => this.handleError(err)
      });
  }

  SOSEmergency(): void {
    this.confirmSOS = !this.confirmSOS;
  }

  confirmSOSEmergency(): void {
    this.confirmSOS = false;
    this.loading = true;

    this.gpsService.SOSEmergency()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        error: (err) => this.handleError(err)
      });
  }

  closeError(): void {
    this.errorAlert = false;
    this.error = null;
  }

  async ngOnInit(): Promise<void> {
    this.loading = true;

    await Promise.allSettled([
      this.getGPSFiles(),
      this.getGPSStatus(),
      this.getInterval(),
      this.getFileRangeTime(),
      this.getEmail(),
      this.getCurrentCoordinates()
    ]);

    this.loading = false;

    interval(10000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        void this.getCurrentCoordinates();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  refreshMap(): void {
    window.location.reload();
  }
}
