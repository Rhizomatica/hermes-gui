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
  enableArray: any = [];


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
          this.loadArrayMode(data)
          this.loadArrayEnable(data)
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
      this.modeArray.push(item.mode === 'LSB' ? true : false)
    });
  }

  loadArrayEnable(data) {
    this.enableArray = []
    data.forEach(item => {
      this.enableArray.push(item.enable === 1 ? true : false)
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

  changeMode(frequency, newValue) {
      newValue = newValue == true ? false : true
      this.setObjectFrequency(frequency.id)
      this.currentFrequency.mode = newValue == true ? "LSB" : "USB"
      this.update(this.currentFrequency)
  }

  changeEnable(frequency, newValue) {
    console.log(newValue)
    newValue = newValue == true ? false : true
    this.setObjectFrequency(frequency.id)
    this.currentFrequency.enable = newValue == true ? 1 : 0
    this.update(this.currentFrequency)
  }

  changeFrequency(frequency, newValue): void {
    this.setObjectFrequency(frequency.id)
    this.currentFrequency.frequency = newValue == null ? 0 : newValue
    this.update(this.currentFrequency)
  }

  changeNickname(frequency, newValue): void {
    this.setObjectFrequency(frequency.id)
    this.currentFrequency.nickname = newValue == null ? "" : newValue
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
