import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/_services/shared.service';
import { Radio } from 'src/app/interfaces/radio';

@Component({
  selector: 'app-radio-connection-alert',
  templateUrl: './radio-connection-alert.component.html',
  styleUrls: ['./radio-connection-alert.component.less']
})
export class RadioConnectionAlertComponent {
  
  public radio: Radio
  private radioSubscription!: Subscription

  constructor(private sharedService: SharedService
  ) {
    this.radio = this.sharedService.radioObj.value
    this.radioSubscription = this.sharedService.radioObj.subscribe(radio => {
      this.radio = radio;
    });
  }

  ngOnDestroy(): void {
    this.radioSubscription?.unsubscribe();
  }
}