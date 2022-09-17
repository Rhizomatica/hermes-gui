import { Component, OnInit, NgModule } from '@angular/core';
import { User } from '../../../interfaces/user';
import { Station } from '../../../interfaces/station';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { NgForm} from '@angular/forms';
import { StationService } from '../../../_services/station.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.less']
})

export class StationsComponent implements OnInit {
  error: Error;
  stations: any;
  currentUser: User;
  isAdmin = true;
  enabledStations: any;
  schedule: any;
  errormessage: string;
  updateAlert = false;
  deftitle: string;
  defstart: Date;
  defstop: Date;
  defenable: boolean;
  stationedit = false;
  errorAlert = false;
  system: any;
  isGateway = false;
  loading = true;
  currentStation: Station

  constructor(private authenticationService: AuthenticationService,
    private apiService: ApiService,
    private stationService: StationService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getSystemStatus(): void{
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        this.isGateway = this.system.gateway;
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  changeStationStatus(event) {
    this.currentStation = this.stations.filter((a)=>{ return a.alias === event.target.value})[0] 
    if (this.stationedit === true) {
      this.stationedit = false
    } else {
      this.stationedit = true;
    }
  }

  cancelChange(){
    this.stationedit = false
    this.loading = false
    this.currentStation = null
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
           this.loading = false;
         }
       }, (err) => {
           this.error = err;
           this.errorAlert = true;
           this.loading = false;
          }
     );
   }

   selectStations(){    
     if (this.enabledStations.includes(this.currentStation.alias) === false) {
        this.enabledStations.push(this.currentStation.alias);
        this.switchChecked(true, this.currentStation.alias)
    } else {
      this.enabledStations = this.enabledStations.filter(e => e !== this.currentStation.alias);
      this.switchChecked(false, this.currentStation.alias)
    }
  }

  switchChecked(checked, station): void{
    this.stations.forEach(element => {
      if(element.alias === station)
        element.checked = checked
    });
  }

   getSchedule($id): void {
    this.apiService.getSchedule($id).subscribe(
      (data:any) => {
        this.schedule = data;
        this.enabledStations = this.schedule.stations;
        this.deftitle = this.schedule.title;
        this.defstart = this.schedule.starttime;
        this.defstop = this.schedule.stoptime;
        this.defenable = this.schedule.enable;
        this.validateStationsObject()
        return data;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  } 

  validateStationsObject(){
    if(!this.enabledStations || !this.enabledStations.stations){
      this.enabledStations = ["local"];
      this.deftitle = 'default';
      this.defstart = new Date('00:00:00');
      this.defstop = new Date('24:00:00');
      this.defenable = false;
    }
  }

  async updateStations(id: number, f:NgForm): Promise<void> {

    this.selectStations()

    this.loading = true;
    this.updateAlert = false;
    f.value.stations = this.enabledStations;
    f.value.title = this.deftitle;
    f.value.starttime = this.defstart;
    f.value.stoptime = this.defstop;
    f.value.enable = this.defenable;
    await this.apiService.updateSchedule(id, f.value ).subscribe(
      (data:any) => {
        this.enabledStations = data.stations;
        this.getSchedule('1');
        this.getStations();
        this.loading = false;
      }, (err) => {
          this.errormessage = err;
          this.errorAlert = true;
          this.loading = false;
        }
    );
    this.stationedit = false;
  }

  closeError() {
    this.errorAlert = false;
  }

  ngOnInit(): void {
    this.getSystemStatus();
    this.getSchedule('1');
    this.getStations();
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false; 
    }
  }
}


