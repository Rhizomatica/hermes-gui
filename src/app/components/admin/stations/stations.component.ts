import { Component, OnInit, NgModule } from '@angular/core';
import { User } from '../../../interfaces/user';
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
  success = '';
  test = '';
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
        console.log(this.system);
        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  confirmChange() {
    if (this.stationedit === true) {
      this.stationedit = false
    } else {
      this.stationedit = true;
    }
  }

  public getStations(): void {
    this.stationService.getStations().subscribe(
       (data: any) => {
         this.stations = data;
         this.stations = this.stations.filter(e => e.alias !== 'central');
        // this.comparedStations = [];
         for (var i in this.stations) {
           for (var j in this.enabledStations) {
             if (this.stations[i].alias == this.enabledStations[j]) {
               this.stations[i].checked = true;
               //this.comparedStations.push(this.stations[i]);
               break;
             } else {
               this.stations[i].checked = false;
             }
           }
         }
       }, (err) => {
           this.error = err;
           console.log(this.error);
         }
     );
     //this.stations = this.stations.filter( e => e['alias'] !== 'central');
   }

   selectStations(ev){    
     if (this.enabledStations.includes(ev.target.value) === false) {
        this.enabledStations.push(ev.target.value);
        this.switchChecked(true, ev.target.value)

    } else {
      this.switchChecked(false, ev.target.value)
      this.enabledStations = this.enabledStations.filter(e => e !== ev.target.value);
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
        //console.log(this.schedule, 'iiiii');
        return data;
      },
      (err) => {
        this.error = err;
      }
    );
  } 

  async updateStations(id: number, f:NgForm): Promise<void> {
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
      }, (err) => {
          this.errormessage = err;
		      console.log(this.errormessage);
          this.errorAlert = true;
        }
    );
    this.stationedit = false;
  }

  ngOnInit(): void {
    this.getSystemStatus();
    this.getSchedule('1');
    this.getStations();
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    } else {
      this.isAdmin = false; }
  }
}


