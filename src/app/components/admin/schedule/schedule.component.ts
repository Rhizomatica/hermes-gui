import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { StationService } from '../../../_services/station.service';
import { NgForm } from '@angular/forms';

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
  localDateHour = null
  
  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private stationService: StationService) {
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

  public getSchedules(): void {
    this.apiService.getSchedules().subscribe(
      (res: any) => {
        this.schedules = res;
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  newSchedule() {
    this.isEditing = true;
    this.selectedSchedule = [];
    this.emptySchedule = true;
  }

  async deleteSchedule($id): Promise<void> {
    this.loading = true
    this.isEditing = false;
    this.selectedSchedule = [];
    this.emptySchedule = true;
    await this.apiService.deleteSchedule($id).subscribe(
      (data: any) => {
        this.getSchedules();
      }, (err) => {
        this.error = err
        this.errorAlert = true;
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


  //TODO - nao esta sendo utilizado
  getSchedule($id): void {
    this.apiService.getSchedule($id).subscribe(
      (data: any) => {
        this.schedule = data;
        this.schedules.starttime = this.schedules.starttime.toString().slice(0, -3)
        this.schedules.stoptime = this.schedules.stoptime.toString().slice(0, -3)
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  onSelect(schedule): void {
    this.selectedSchedule = schedule;
    if(this.selectedSchedule.starttime >= 8){
      this.selectedSchedule.starttime = this.selectedSchedule.starttime.toString().slice(0, -3)
      this.selectedSchedule.stoptime = this.selectedSchedule.stoptime.toString().slice(0, -3)
    }
    this.isEditing = true;
    this.emptySchedule = false;
  }

  setLocalDateHour(){
    this.localDateHour = new Date();
    const yyyy = this.localDateHour.getFullYear();
    let mm = this.localDateHour.getMonth() + 1; // Months start at 0!
    let dd = this.localDateHour.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    this.localDateHour = dd + '/' + mm + '/' + yyyy + " " + new Date().toLocaleTimeString();
  }

  ngOnInit(): void {
    this.schedules = [];
    this.selectedSchedule = [];
    this.getSchedules();
    this.getStations();
    this.setLocalDateHour()
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

}
