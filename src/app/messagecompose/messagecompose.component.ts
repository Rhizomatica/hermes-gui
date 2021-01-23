import { Component, OnInit } from '@angular/core';
import { HmheaderComponent } from '../hmheader/hmheader.component';
import { Observable, of, throwError } from 'rxjs';
import { NgForm} from '@angular/forms';
import { Message } from '../message';
import { MessageService } from '../message.service';
import { ViewChild } from '@angular/core';


import { Station } from '../station';
import { StationService } from '../station.service';
import { StationsComponent } from '../stations/stations.component';
import { GlobalConstants } from '../global-constants';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})


export class MessagecomposeComponent implements OnInit {

  public messages: Message[];
  public message: Message;
  public error: any;
  public id: any;
  public stations: Station[];
  private fileProcessed: boolean = true;
  public fileIsProcessing: boolean;
  public fileIsProcessed: boolean;

  constructor(private messageService: MessageService, private stationService: StationService) {}

  sendMessage(f: NgForm): void {
    this.messageService.createMessage(f.value).subscribe();
  }

  DocUpload($files): void{
    console.log(this.messageService.postFile($files[0]));
    /*
    this.messageService.postFile($files[0]).subscribe(
      this.messageService.postFile($files[0]).subscribe(
      (res: any) => {
        this.id = res;
      },
      (err) => {
        this.error = err;
      }
    );
  */
    }
  

  getMessage(id: number): void {
    this.messageService.getMessage(id).subscribe(
      (res: any) => {
        this.message = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  ngOnInit(): void {
    this.getMessage(1);
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);
  }

}
