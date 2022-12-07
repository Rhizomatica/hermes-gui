import { Component, OnInit } from '@angular/core';
import { Schedule } from 'src/app/interfaces/schedule';
import { Station } from 'src/app/interfaces/station';
import { ApiService } from '../../../_services/api.service';
import { StationService } from '../../../_services/station.service';

@Component({
  selector: 'app-netadmin',
  templateUrl: './netadmin.component.html',
  styleUrls: ['./netadmin.component.less']
})

export class NetadminComponent implements OnInit {

  error: any
  system: any
  errorAlert = false
  loading = true
  stations: Station[]
  enabledStations: Station[]
  schedules: Schedule[]

  constructor(
    private apiService: ApiService,
    private stationService: StationService) {
  }

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res
        this.loading = false
        return res
      },
      (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    )
  }

  public getStations(): void {
    this.loading = true
    this.stationService.getStations().subscribe(
      (data: any) => {
        this.stations = data;
        this.stations = this.stations.filter(e => e.alias !== 'central');
        this.getSchedules()
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false;
      }
    );
  }

  getSchedules(): void {
    this.apiService.getSchedules().subscribe(
      (data: any) => {
        this.schedules = data
        this.loading = false
        this.loadEnabledStations()
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  loadEnabledStations(): void {
    this.stations.forEach(station => {
      station.checked = false
      this.schedules.forEach(schedule => {
        schedule.stations.forEach(scheduleStation => {
          if (scheduleStation === station.alias) {
            station.checked = true
          }
        });
      });
    });
  }

  closeError() {
    this.errorAlert = false
  }

  ngOnInit(): void {
    this.getSystemStatus()
    this.getStations()
  }
}
