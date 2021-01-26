import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Message } from '../message';
import { MessageService } from '../message.service';

import { Station } from '../station';
import { StationService } from '../station.service';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})


export class MessagecomposeComponent implements OnInit {

  public error: any;
  public res: any;
  public stations: Station[];
  private fileProcessed: boolean = true;
  public fileIsProcessing: boolean = false;
  public fileIsProcessed: boolean = false;
  public isEncrypted: boolean = false;
  public message: Message;

  /*public message:Message = {
    id: null,
    name: "",
    orig: "",
    dest: "",
    text: "",
    file: "",
    draft: null,
    sent_at: ""
  }*/

  constructor(private messageService: MessageService, private stationService: StationService) {}

  createMessage(f: NgForm): void {
      this.messageService.createMessage(f.value,  this.message.file, this.message.id).subscribe(
      (res: any) => {
        this.res = res;
        console.log(res);
        //this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  encrypted() {
    if(this.isEncrypted) {
      this.isEncrypted = false;
      //console.log(this.isEncrypted);
    } else {
      this.isEncrypted = true;
      //console.log(this.isEncrypted);
    }
  }

  retry() {
    this.error = false;
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

  ngOnInit(): void {
    this.message = {
      id: null,
      name: "",
      orig: "",
      dest: "",
      text: "",
      file: "",
      draft: null,
      sent_at: ""
    }

    this.isEncrypted = false;
    this.fileIsProcessing = false;
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);
  }

}
