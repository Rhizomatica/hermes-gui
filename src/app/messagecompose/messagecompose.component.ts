import { Component, OnInit } from '@angular/core';
import { HmheaderComponent } from '../hmheader/hmheader.component';
import { Observable, of, throwError } from 'rxjs';
import { NgForm} from '@angular/forms';
import { Message } from '../message';
import { MessageService } from '../message.service';

import { Station } from '../station';
import { StationService } from '../station.service';
import { StationsComponent } from '../stations/stations.component';

@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})

export class MessagecomposeComponent implements OnInit {
  public message: Message[];

  public stations: Station[];
  private error: String;
  //private isEditing: boolean = true;

  constructor(private messageService: MessageService, private stationService: StationService) {}

  onSubmitCreateMessage(f: NgForm): void {
    this.messageService.createMessage(f.value).subscribe();
    console.log(f.value);
    //this.isEditing = false;
    //console.log(this.isEditing);

  }


  getMessage(): void {
    this.messageService.getMessage(1).subscribe(
      (res: any) => {
        this.message = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  ngOnInit(): void {
    this.messageService.getMessage(1)
    .subscribe(message =>  this.message = message);
  
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);
  }

}
