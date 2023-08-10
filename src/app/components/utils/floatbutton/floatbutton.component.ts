import { Component, OnChanges, Input } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';
import { GlobalConstants } from 'src/app/global-constants';

@Component({
  selector: 'floatbutton',
  templateUrl: './floatbutton.component.html',
  styleUrls: ['./floatbutton.component.less']
})

export class FloatButtonComponent{

  constructor(
    private apiService: ApiService,
  ) {
    
  }

  @Input() shuttingDown: Boolean
  @Input() shuttingDownNow: Boolean

  ngOnInit(): void { }


  confirmShutDown() {
    console.log('entrou')
    this.shuttingDown = true;
  }

  cancelShutDown() {
    this.shuttingDown = false;
    this.shuttingDownNow = false;
  }

  shutDown() {
    this.shuttingDownNow = true;
    this.apiService.sysShutdown();
  }
}