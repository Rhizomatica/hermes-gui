import { Component } from '@angular/core';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';

@Component({
  selector: 'app-radio-connection-alert',
  templateUrl: './radio-connection-alert.component.html',
  styleUrls: ['./radio-connection-alert.component.less']
})
export class RadioConnectionAlertComponent {
  
  public radio: Radio

  constructor(private sharedService: SharedService
  ) {
    this.radio = this.sharedService.radioObj.value
  }
}