import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';
import { Schedule } from '../schedule';
import { Station } from '../station';
import { StationService } from '../_services/station.service';
import { NgForm} from '@angular/forms';


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
  error: any;
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
  connected: any;
  deftitle: string;
  defstart: boolean;
  defstop: boolean;
  defenable: boolean;
  defid:number;
  stationedit = false;
  updateAlert = false;
  canDelete = true;


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
        // console.log(this.stations, 'bibibi');
       // this.comparedStations = [];
        for (var i in this.stations) {
          // console.log(this.stations[i]);
          for (var j in this.enabledStations) {
            // console.log(this.enabledStations[j], 'kkk');
            if (this.stations[i].alias == this.enabledStations[j]) {
              this.stations[i].checked = true;
              //this.comparedStations.push(this.stations[i]);
              break;
            } else {
              this.stations[i].checked = false;
            }
          }
        }
        // console.log(this.stations, 'eeeeee');
        // console.log(this.stations);
      }, (err) => {
          this.error = err;
		      console.log(this.error);
        }
    );

    
    //this.stations = this.stations.filter( e => e['alias'] !== 'central');

  }


  updateSchedule(id: number, f:NgForm):void {
    f.value.stations = this.enabledStations;
    this.apiService.updateSchedule(id, f.value ).subscribe(
      (data: any) => {
        this.stations = data;
        console.log(this.stations, 'lllll');
        this.getStations();
      }, (err) => {
          this.error = err;  
		      console.log(this.error);
        }
    );
  }

selectStations(ev){
  if(ev.target.checked == true) {
    if (this.enabledStations.includes(ev.target.value) === false) this.enabledStations.push(ev.target.value);
  } else {
    this.enabledStations = this.enabledStations.filter(e => e !== ev.target.value);
  }
  console.log(this.enabledStations);
}

async updateStations(id: number, f:NgForm): Promise<void> {
    this.updateAlert = false;
    f.value.stations = this.enabledStations;
    f.value.title = this.deftitle;
    f.value.starttime = this.defstart;
    f.value.stoptime = this.defstop;
    f.value.enable = this.defenable;
    // console.log(f.value, 'hihihi');
    await this.apiService.updateSchedule(id, f.value ).subscribe(
      (data:any) => {
        this.stations = data;
        this.getSchedules();
        this.getSchedule('1');
        this.getStations();
        // console.log(this.stations);
      }, (err) => {
          this.error = err;
		      console.log(this.error);
          this.errorAlert = true;
        }
    );

    this.stationedit = false;
    // console.log(this.stations);
    // console.log(this.enabledStations, 'wwww');
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

  public getSchedules():void {
    this.apiService.getSchedules().subscribe(
      (res: any) => {
        this.schedules = res;
        this.noSchedules = false;
        // console.log(this.schedules, 'aaaaa');
        this.enabledStations = this.schedules[0].stations;
        this.deftitle = this.schedules[0].title;
        this.defstart = this.schedules[0].starttime;
        this.defstop = this.schedules[0].stoptime;
        this.defenable = this.schedules[0].enable;
        this.defid = this.schedules[0].id;
        // console.log(this.enabledStations, 'uuuu');
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  newSchedule() {
  this.isEditing = true;
  this.selectedSchedule = [];
  this.emptySchedule = true;
  }

  async deleteSchedule($id): Promise<void> {
    if ($id > 1) {
      await this.apiService.deleteSchedule($id).subscribe();
      this.isEditing = false;
      this.getSchedules();
    } 
  }

  async createSchedule(f:NgForm): Promise<void> {
    f.value.stations = this.enabledStations;
    await this.apiService.createSchedule(f.value).subscribe();
    this.getSchedules();
    this.isEditing = false;
  }

  getSchedule($id): void {
    this.apiService.getSchedule($id).subscribe(
      (data:any) => {
        this.schedule = data;
        // console.log(this.schedule, 'iiiii');
      },
      (err) => {
        this.error = err;
      }
    );
  }

  onSelect(schedule): void {
    this.selectedSchedule = schedule;
    // console.log(this.selectedSchedule, 'dadaada');
    this.isEditing = true;
    // console.log('⚚ management - onSelect: isEditing? ', this.isEditing);
    this.emptySchedule = false;

    if (this.selectedSchedule.id === '1') {
      this.canDelete = false;
    } else {
      this.canDelete = true;
    }
    // console.log('⚚ management - onSelect: isEditing? ', this.selectedUser);

  }

  showStations() {
    if (this.showSt === false) {
      this.showSt = true;
      // console.log(this.showSt);
    }
    else {
      this.showSt = false;
      // console.log(this.showSt);
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
