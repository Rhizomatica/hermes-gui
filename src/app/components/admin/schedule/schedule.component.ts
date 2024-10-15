import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { StationService } from '../../../_services/station.service';
import { NgForm } from '@angular/forms';
import { SharedService } from 'src/app/_services/shared.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.less']
})

export class ScheduleComponent implements OnInit {

  currentUser: User;
  stations: any;
  isAdmin = true;
  enabled = true;
  error = Error;
  errorAlert = false;
  isEditing = false;
  selectedSchedule: any;
  schedules: any;
  schedule: any;
  emptySchedule = false;
  enabledStations: any;
  showSt = false;
  stationedit = false;
  updateAlert = false;
  timeerror = false;
  loading = true;
  serverDateTime = null;
  confirmDeleteSchedule: boolean = false;
  public radio: any = []

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private stationService: StationService,
    private sharedService: SharedService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  public getStations(): void {
    this.stationService.getStations().subscribe(
      (data: any) => {
        this.stations = data;
        this.stations = this.stations.filter(e => e.alias !== 'central' && e.alias !== 'gw' && e.alias !== 'local');
        for (var i in this.stations) {
          for (var j in this.enabledStations) {
            if (this.stations[i].alias == this.enabledStations[j]) {
              this.stations[i].checked = true;
              break;
            } else {
              this.stations[i].checked = false;
            }
          }
        }
        this.loading = false

      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  public closeError() {
    this.errorAlert = false;
  }

  public compareTime(start: Date, stop: Date) {
    if (start > stop) {
      this.timeerror = true;
    } else {
      this.timeerror = false;
    }
  }

  updateSchedule(id: number, f: NgForm): void {

    if (!f.value.stations) {
      f.value.stations = this.selectedSchedule.stations
    }

    f.value.starttime += ":00"
    f.value.stoptime += ":00"

    this.loading = true
    this.apiService.updateSchedule(id, f.value).subscribe(
      (res: any) => {
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  confirmChange() {
    this.updateAlert = true;
  }

  confirmDelete() {
    this.confirmDeleteSchedule = !this.confirmDeleteSchedule ? true : false
  }

  public getSchedules(): void {
    this.apiService.getSchedules().subscribe(
      (res: any) => {
        this.schedules = res
        this.loading = false
        this.formatTime(this.schedules)
      },
      (err) => {
        this.error = err;
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  formatTime(schedules) {
    schedules.forEach(schedule => {
      schedule.starttime = schedule.starttime.toString().slice(0, -3)
      schedule.stoptime = schedule.stoptime.toString().slice(0, -3)
    });
  }

  newSchedule() {
    this.isEditing = true
    this.selectedSchedule = []
    this.emptySchedule = true
  }

  async deleteSchedule($id): Promise<void> {
    this.loading = true
    this.isEditing = false
    this.selectedSchedule = []
    this.emptySchedule = true
    this.confirmDeleteSchedule = false
    await this.apiService.deleteSchedule($id).subscribe(
      (data: any) => {
        this.getSchedules()
      }, (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );

  }

  async createSchedule(f: NgForm): Promise<void> {
    this.loading = true

    if (!f.value.enable || f.value.enable == 0) {
      f.value.enable = false
    }

    f.value.starttime += ":00"
    f.value.stoptime += ":00"

    await this.apiService.createSchedule(f.value).subscribe(
      (data: any) => {
        this.getSchedules();
      }, (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
        this.errorAlert = true
      }
    );

    this.isEditing = false;
  }


  onSelect(schedule): void {
    this.selectedSchedule = schedule;
    if (this.selectedSchedule.starttime >= 8) {
      this.formatTime([this.selectedSchedule])
    }
    this.isEditing = true;
    this.emptySchedule = false;
  }

  ngOnInit(): void {
    this.schedules = [];
    this.selectedSchedule = [];
    this.getSchedules();
    this.getStations();

    this.radio = this.sharedService.radioObj.value

    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

}
