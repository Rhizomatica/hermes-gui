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
  isEditing = false;
  selectedSchedule: any;
  schedules: any;
  schedule: any;
  emptySchedule = false;
  enabledStations: any;
  showSt = false;
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

  confirmChange() {
    this.updateAlert = true;
  }

  public getSchedules(): void {
    this.apiService.getSchedules().subscribe(
      (res: any) => {
        if (res.length > 0) {
          this.schedules = res;
          // this.schedules[0].starttime = this.schedules[0].starttime.toString().slice(0, -3)
          // this.schedules[0].stoptime = this.schedules[0].stoptime.toString().slice(0, -3)         
        }

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
    this.isEditing = false;
    this.selectedSchedule = [];
    this.emptySchedule = true;
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
    this.isEditing = true;
    this.emptySchedule = false;

    console.log("Selected "+this.selectedSchedule.stations)

    if (this.selectedSchedule.id == '1') {
      this.canDelete = false;
    } else {
      this.canDelete = true;
    }
  }

  ngOnInit(): void {
    this.schedules = [];
    this.selectedSchedule = [];
    this.getSchedules();
    this.getStations();
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
  }

}
