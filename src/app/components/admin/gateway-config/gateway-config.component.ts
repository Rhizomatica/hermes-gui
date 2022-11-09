import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { StationService } from '../../../_services/station.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-gateway-config',
  templateUrl: './gateway-config.component.html',
  styleUrls: ['./gateway-config.component.less']
})

export class GatewayConfigComponent implements OnInit {

  currentUser: User;
  stations: any;
  isAdmin = true;
  enabled = true;
  error = Error;
  errorAlert = false;
  noSchedules = true;
  isEditing = false;
  selectedSchedule: any;
  schedules: any;
  schedule: any;
  emptySchedule = false;
  enabledStations: any;
  comparedStations: any;
  showSt = false;
  data: any;
  deftitle: string;
  defstart: boolean;
  defstop: boolean;
  defenable: boolean;
  defid: number;
  stationedit = false;
  updateAlert = false;
  canDelete = true;
  timeerror = false;
  loading = true;

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
        this.stations = this.stations.filter(e => e.alias !== 'central');
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
    this.loading = true
    f.value.stations = this.enabledStations;
    this.apiService.updateSchedule(id, f.value).subscribe(
      (res: any) => {
        this.stations = res;
        this.getStations();
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  selectStations(ev) {
    if (ev.target.checked == true) {
      if (this.enabledStations.includes(ev.target.value) === false) this.enabledStations.push(ev.target.value);
    } else {
      this.enabledStations = this.enabledStations.filter(e => e !== ev.target.value);
    }
  }

  async updateStations(id: number, f: NgForm): Promise<void> {
    this.updateAlert = false;
    f.value.stations = this.enabledStations;
    f.value.title = this.deftitle;
    f.value.starttime = this.defstart;
    f.value.stoptime = this.defstop;
    f.value.enable = this.defenable;
    await this.apiService.updateSchedule(id, f.value).subscribe(
      (data: any) => {
        this.stations = data;
        this.getSchedules();
        this.getSchedule('1');
        this.getStations();
      }, (err) => {
        this.error = err
        this.errorAlert = true;
      }
    );
    this.stationedit = false;
  }

  stationChange() {
    if (this.stationedit === true) {
      this.stationedit = false
    } else {
      this.stationedit = true;
    }
  }

  confirmChange() {
    this.updateAlert = true;
  }

  public getSchedules(): void {
    this.apiService.getSchedules().subscribe(
      (res: any) => {
        this.schedules = res;
        this.noSchedules = false;
        this.enabledStations = this.schedules[0].stations;
        this.deftitle = this.schedules[0].title;
        this.defstart = this.schedules[0].starttime;
        this.defstop = this.schedules[0].stoptime;
        this.defenable = this.schedules[0].enable;
        this.defid = this.schedules[0].id;
        this.loading = false
        return res;
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
    if ($id > 1) {
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
  }

  async createSchedule(f: NgForm): Promise<void> {
    this.loading = true

    f.value.stations = this.enabledStations;

    if (!f.value.enable || f.value.enable == 0) {
      f.value.enable = false
    }

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

  getSchedule($id): void {
    this.apiService.getSchedule($id).subscribe(
      (data: any) => {
        this.schedule = data;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  onSelect(schedule): void {
    this.selectedSchedule = schedule;
    this.isEditing = true;
    this.emptySchedule = false;

    if (this.selectedSchedule.id == '1') {
      this.canDelete = false;
    } else {
      this.canDelete = true;
    }
  }

  showStations() {
    if (this.showSt === false) {
      this.showSt = true;
    }
    else {
      this.showSt = false;
    }
  }

  ngOnInit(): void {
    this.schedules = [];
    this.selectedSchedule = [];
    this.getSchedules();
    this.getSchedule('1');
    this.getStations();
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }
  
}
