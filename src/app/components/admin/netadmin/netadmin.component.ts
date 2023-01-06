import { Component, OnInit } from '@angular/core';
import { Frequency } from 'src/app/interfaces/frequency';
import { FrequencyService } from 'src/app/_services/frequency.service';
import { ApiService } from '../../../_services/api.service';

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
  public freqmin = 500
  public freqmax = 30000
  frequency = 500
  modeSwitch: boolean
  mode: string
  frequencies: Frequency[]
  frequencyArray: any = [{ key: 1, values: '' }];
  currentFrequency: Frequency

 
  

  constructor(
    private apiService: ApiService,
    // private stationService: StationService,
    private frequencyService: FrequencyService
    ) {
  }

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res
        this.loading = false
      },
      (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    )
  }

  public getFrequencies(): void {
    this.loading = true
      this.frequencyService.getFrequencies().subscribe(
        (data: any) => {
          this.frequencies = data;
          this.loadArrayFrequencies(data)
          this.loading = false
        }, (err) => {
          this.error = err;
          this.errorAlert = true;
          this.loading = false;
        }
      );
  }

  loadArrayFrequencies(data) {
    data.forEach(item => {
      this.frequencyArray.push(item)
    });
  }

  closeError() {
    this.errorAlert = false
  }

  changeMode(event) {
    // this.modeSwitch = this.modeSwitch === true ? false : true;
    // console.log(event)
    // this.radioService.setRadioMode(this.modeSwitch ? 'LSB' : 'USB').subscribe(
    //   (res: any) => {
    //     this.res = res;
    //     this.radio.mode = res;
    //   }, (err) => {
    //     this.error = err;
    //     this.errorAlert = true;
    //   }
    // );
  }

  changeFrequency(id, frequency): void {
    this.setObjectFrequency(id)
    this.currentFrequency.frequency = frequency

    this.frequencyService.updateFrequency(id, this.currentFrequency).subscribe(
      (res: any) => {
        this.getFrequencies()
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );  
  }

  setObjectFrequency(id): void{

    var station = this.frequencies.filter((a)=>{ return a.id = id})[0]

    this.currentFrequency = {
      id : station.id,
      alias: station.alias,
      nickname: station.nickname,
      frequency : station.frequency,
      mode: station.mode,
      enable: station.enable
    }
  }
  

  ngOnInit(): void {
    this.getSystemStatus()
    this.getFrequencies()
    // this.getStations()
  }
}
