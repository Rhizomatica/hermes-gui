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
import { Location } from '@angular/common';

@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})


export class MessagecomposeComponent implements OnInit {

  public message: Message;

  public error: any;
  public serverReturn: any;
  public stations: Station[];
  private fileProcessed: boolean = true;
  public fileIsProcessing: boolean;
  public fileIsProcessed: boolean;

  constructor(private messageService: MessageService, private stationService: StationService) {}

  createMessage(f: NgForm): void {
    console.log(f.value);
    this.messageService.createMessage(f.value).subscribe(
      (res: any) => {
        this.serverReturn = res;
        console.log( "componente");
      },
      (err) => {
        this.error = err;
      }
    );
  }

  DocUpload(files): void{
    //this.messageService.postFile($files[0]);
    console.log(files);
    this.messageService.postFile(files[0]).subscribe(
      (res: any) => {
        this.message.id = res[2];
        this.message.file = res[1];
      },
      (err) => {
        this.error = err;
      }
    );
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
