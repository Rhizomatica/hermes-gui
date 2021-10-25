import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Message } from '../message';
import { MessageService } from '../_services/message.service';
import { Station } from '../station';
import { StationService } from '../_services/station.service';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../user';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less']
})
export class UploadComponent implements OnInit {

  public error: Error;
  public fileError: any = "";
  public res: any;
  public stations: Station[];
  private fileProcessed = true;
  public fileIsProcessing = false;
  public fileIsProcessed = false;
  public isEncrypted = false;
  public message: Message;
  public passMatch: boolean = false;
  public passwd;
  public repasswd;
  public serverConfig: any;
  public allowfile: any;
  public allowUpload: boolean = false;
  public currentUser: User;
  public isLoggedIn: boolean;
  public isAdmin: boolean = false;
  public passunMatch: boolean = false;
  public passMin: boolean = false;
  public errorAlert: boolean = false;
  public fileName: any;
  public description: any;
  public file: any;


  constructor(
    private messageService: MessageService, 
    private apiService: ApiService,
    private stationService: StationService,
    private authenticationService: AuthenticationService) {
      
    }


handleFile() {
  console.log()
}    


onFileSelected(event) {

  const file:File = event.target.files[0];
  console.log(event)

  if (file) {
    this.file = file;
      this.fileName = file.name;
      const formData = new FormData();
      formData.append("thumbnail", file);
      //const upload$ = this.http.post("/api/thumbnail-upload", formData);
      const upload$ = formData;
      //upload$.subscribe();
      console.log(formData);
      return file;
  }
  
}


uploadFile(f: NgForm) {
  console.log(f.value.description);
  console.log(this.file);
  console.log(this.fileName);
}


  ngOnInit(): void {
  }

}
