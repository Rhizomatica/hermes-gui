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
  
  public stations: Station[];
  private error: String;
  public isProcessing: boolean = false;
  public processed: boolean = false;
  fileToUpload: File = null;
  afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.txt,.pdf",
    maxSize: "0.1",
    uploadAPI:  {
      url: GlobalConstants.apiURL+"/file",
      method:"POST",
      //"Authorization" : `Bearer ${token}`
      headers: {
     "Content-Type" : "text/plain;charset=UTF-8",
      },
      params: {
        'id': '1'
      },
      responseType: 'blob',
    },
    theme: "dragNDrop",
    hideProgressBar: false,
    hideResetBtn: false,
    fileNameIndex: false,
    hideSelectBtn: false,
    replaceTexts: {
      selectFileBtn: 'Select Files',
      resetBtn: 'Reset',
      uploadBtn: 'Upload',
      dragNDropBox: 'Drag N Drop',
      attachPinBtn: 'Attach Files...',
      afterUploadMsg_success: 'Successfully Uploaded !',
      afterUploadMsg_error: 'Upload Failed !',
      sizeLimit: 'Size Limit'
    }
};

  //private isEditing: boolean = true;

  constructor(private messageService: MessageService, private stationService: StationService) {}

  sendMessage(file: any, f: NgForm): void {
    this.messageService.createMessage(file, f.value).subscribe();
    this.isProcessing = true;
    console.log(f.value);
    console.log(file);
    this.processed = true;
  }



  DocUpload($event): void{
    console.log($event);

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
