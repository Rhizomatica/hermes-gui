import { Component, OnInit } from '@angular/core';
import { HmheaderComponent } from '../hmheader/hmheader.component';
import { Observable, of, throwError } from 'rxjs';
import { NgForm} from '@angular/forms';
import { Message } from '../message';
import { MessageService } from '../message.service';
import { ViewChild } from '@angular/core';
import { AngularFileUploaderComponent } from "angular-file-uploader";



import { Station } from '../station';
import { StationService } from '../station.service';
import { StationsComponent } from '../stations/stations.component';
import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})


export class MessagecomposeComponent implements OnInit {

  @ViewChild('fileUpload1')
  public fileUpload1:  AngularFileUploaderComponent;

  //CHeck it

  public messages: Message[];
  public message: Message;
  
  public stations: Station[];
  private error: String;
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

  onSubmitCreateMessage(f: NgForm): void {
    this.messageService.createMessage(f.value).subscribe();
    console.log(f.value);
  }

  DocUpload($event): void{
    console.log($event);
    console.log(this.fileUpload1.currentUploads);
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
