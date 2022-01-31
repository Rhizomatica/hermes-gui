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
  noSchedules = true;
  isEditing = false;
  selectedSchedule: any;
  schedules: any;
  schedule: any;
  emptySchedule = false;
  enabledStations: any;
  showSt = false;
  data: any;
  connected: any;
  deftitle: string;
  defstart: boolean;
  defstop: boolean;
  defenable: boolean;
  defid:number;

  constructor(
    private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private stationService: StationService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getStations(): void {
    this.stationService.getStations().subscribe(
      
      
      (res: any) => {
        this.stations = res;
        // console.log(this.stations);
      }, (err) => {
          this.error = err;
		      console.log(this.error);
        }
    );
  }

  updateSchedule(id: number, f:NgForm):void {
    f.value.stations = this.enabledStations;
    this.apiService.updateSchedule(id, f.value ).subscribe(
      (res: any) => {
        this.stations = res;
        // console.log(this.stations);
      }, (err) => {
          this.error = err;
		      console.log(this.error);
        }
    );

  }

selectStations(ev, index){
  if(ev.target.checked == true) {
    //this.enabledStations.push(ev.target.value);
    if (this.enabledStations.includes(ev.target.value) === false) this.enabledStations.push(ev.target.value);
  } else {
    for(let i = 0; i < this.enabledStations.lenght; i++) {
      this.enabledStations.splice(i,1);
    }
  }

  console.log(this.enabledStations);

}

  updateStations(id: number, f:NgForm):void {
    f.value.stations = this.enabledStations;
    this.apiService.updateSchedule(id, f.value ).subscribe(
      (res: any) => {
        this.stations = res;
        // console.log(this.stations);
      }, (err) => {
          this.error = err;
		      console.log(this.error);
        }
    );

  }


  public getSchedules():void {
    this.apiService.getSchedules().subscribe(
      (res: any) => {
        this.schedules = res;
        this.noSchedules = false;
        console.log(this.schedules, 'aaaaa');
        this.enabledStations = this.schedules[0].stations;
        this.deftitle = this.schedules[0].title;
        this.defstart = this.schedules[0].starttime;
        this.defstop = this.schedules[0].stoptime;
        this.defenable = this.schedules[0].enable;
        this.defid = this.schedules[0].id;
        console.log(this.enabledStations, 'uuuu');
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  

  getSchedule($id): void {
    this.apiService.getSchedule($id).subscribe(
      (data:any) => {
        this.schedule = data;
        console.log(this.schedule, 'iiiii');
      },
      (err) => {
        this.error = err;
      }
    );
  }

  onSelect(schedule): void {
    this.selectedSchedule = schedule;
    console.log(this.selectedSchedule, 'dadaada');
    this.isEditing = true;
    // console.log('⚚ management - onSelect: isEditing? ', this.isEditing);
    this.emptySchedule = false;
    // console.log('⚚ management - onSelect: isEditing? ', this.selectedUser);

  }

  showStations() {
    if (this.showSt === false) {
      this.showSt = true;
      console.log(this.showSt);
    }
    else {
      this.showSt = false;
      console.log(this.showSt);
    }
  }
  

  ngOnInit(): void {
    this.schedules = [];
    this.selectedSchedule = [];
    this.getStations();
    this.getSchedules();
    this.getSchedule('1');
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false;
    }
    
  }

}
