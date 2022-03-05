import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit, NgModule } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { NgForm} from '@angular/forms';
import { Station } from '../../../interfaces/station';
import { StationService } from '../../../_services/station.service';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.less']
})
export class StationsComponent implements OnInit {
  // error = '';
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

   selectStations(ev){
    if(ev.target.checked == true) {
      if (this.enabledStations.includes(ev.target.value) === false) this.enabledStations.push(ev.target.value);
    } else {
      this.enabledStations = this.enabledStations.filter(e => e !== ev.target.value);
    }
    console.log(this.enabledStations);
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
    // console.log(f.value, 'hihihi');
    await this.apiService.updateSchedule(id, f.value ).subscribe(
      (data:any) => {
        this.enabledStations = data.stations;
        this.getSchedule('1');
        this.getStations();
        //console.log(this.stations, 'kkkkkkk');

        //console.log(this.stations);
      }, (err) => {
          this.errormessage = err;
		      console.log(this.errormessage);
          this.errorAlert = true;
        }
    );

    this.stationedit = false;
    // console.log(this.stations);
    // console.log(this.enabledStations, 'wwww');
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


