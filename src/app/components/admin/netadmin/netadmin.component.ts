import { Component, OnInit } from '@angular/core';
import { Frequency } from 'src/app/interfaces/frequency';
import { FrequencyService } from 'src/app/_services/frequency.service';
import { StationService } from 'src/app/_services/station.service';
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
  frequency = 7000
  modeSwitch: boolean
  mode: string
  frequencies: Frequency[]
  frequencyArray: any = [];
  modeArray: any = [];
  nicknameArray: any = [];
  enableArray: any = [];
  editArray: any = [];
  currentFrequency: Frequency;
  pendingUpdate = false

  constructor(
    private apiService: ApiService,
    private stationService: StationService,
    private frequencyService: FrequencyService) {
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
        this.loadArrayEdit(data)
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true
        this.loading = false
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

  loadArrayEdit(data) {
    this.editArray = []
    data.forEach(item => {
      this.editArray.push(false)
    });
  }

  closeError() {
    this.errorAlert = false
  }

  startEditing(i) {

    for (let index = 0; index < this.editArray.length; index++) {
      this.editArray[index] = false
    }

    this.editArray[i] = true
    this.pendingUpdate = true
  }

  changeEnableSwitch(i) {
    this.getStations(i);
    this.enableArray[i] = this.enableArray[i] == true ? false : true
  }

  changeModeSwitch(i) {
    if (this.enableArray[i] === false)
      return

    this.modeArray[i] = this.modeArray[i] == true ? false : true
  }

  changeMode(newValue) {
    this.currentFrequency.mode = newValue == true ? "LSB" : "USB"
  }

  changeEnable(newValue) {
    this.currentFrequency.enable = newValue == true ? 1 : 0
  }

  changeFrequency(newValue): void {
    this.currentFrequency.frequency = newValue == null ? 500 : newValue
  }

  changeNickname(newValue): void {
    this.currentFrequency.nickname = newValue == null ? "" : newValue
  }

  setObjectFrequency(id): void {
    this.currentFrequency = null
    this.currentFrequency = this.frequencies.filter((a) => { return a.id == id })[0]
  }

  updateItem(frequency, i): void {
    this.setObjectFrequency(frequency.id)
    this.changeNickname(this.nicknameArray[i])
    this.changeEnable(this.enableArray[i])
    this.changeFrequency(this.frequencyArray[i])
    this.changeMode(this.modeArray[i])
    this.editArray[i] = false
    this.update(this.currentFrequency)
    this.pendingUpdate = false
  }

  update(frequency): void {

    if (frequency.frequency === null)
      return

    this.frequencyService.updateFrequency(frequency.id, this.currentFrequency).subscribe(
      (res: any) => {
        this.getFrequencies()
      }, (err) => {
        this.error = err;
        this.errorAlert = true
      }
    );
  }

  public getStationFrequency(data, index){
    var stationAlias = this.frequencies[index].alias
    var newFrequency = data.filter((a) => { return a.alias == stationAlias })[0].frequency

    if (newFrequency != null && newFrequency != undefined) {
      this.frequencyArray[index] = newFrequency
      return
    }

    this.frequencyArray[index] = this.frequency
  }

  public getStations(index): void {
    this.stationService.getStations().subscribe(
      (data: any) => {
        this.getStationFrequency(data, index)
        this.loading = false
      }, (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  ngOnInit(): void {
    this.getSystemStatus()
    this.getFrequencies()
  }
}
