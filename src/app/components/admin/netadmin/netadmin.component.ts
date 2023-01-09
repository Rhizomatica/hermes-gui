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
  frequencyArray: any = [];
  modeArray: any = [];
  nicknameArray: any = [];

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
          this.loadArrayNickname(data)
          this.loading = false
        }, (err) => {
          this.error = err;
          this.errorAlert = true;
          this.loading = false;
        }
      );
  }

  loadArrayFrequencies(data) {
    this.frequencyArray = []
    data.forEach(item => {
      this.frequencyArray.push(item.frequency)
    });
  }

  loadArrayMode(data) {
    this.modeArray = []
    data.forEach(item => {
      this.modeArray.push(item.mode)
    });
  }

  loadArrayEnable(data) {
    this.modeArray = []
    data.forEach(item => {
      this.modeArray.push(item.mode)
    });
  }

  loadArrayNickname(data) {
    this.nicknameArray = []
    data.forEach(item => {
      this.nicknameArray.push(item.nickname)
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

  changeFrequency(frequency, newValue): void {
    this.setObjectFrequency(frequency.id)
    this.currentFrequency.frequency = newValue
    this.update(this.currentFrequency)
  }

  changeNickname(frequency, newValue): void {
    this.setObjectFrequency(frequency.id)
    this.currentFrequency.nickname = newValue
    this.update(this.currentFrequency)
  }

  setObjectFrequency(id): void {
    this.currentFrequency = null
    this.currentFrequency = this.frequencies.filter((a)=>{ return a.id == id })[0]
  }

  update(frequency): void {

    if(frequency.frequency === null)
      return

    this.frequencyService.updateFrequency(frequency.id, this.currentFrequency).subscribe(
      (res: any) => {
        this.getFrequencies()
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );  
  }

  ngOnInit(): void {
    this.getSystemStatus()
    this.getFrequencies()
    // this.getStations()
  }
}
