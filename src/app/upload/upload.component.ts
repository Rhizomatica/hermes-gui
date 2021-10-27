import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Message } from '../message';
import { MessageService } from '../_services/message.service';
import { Station } from '../station';
import { StationService } from '../_services/station.service';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';
import { User } from '../user';
import { stripGeneratedFileSuffix } from '@angular/compiler/src/aot/util';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.less']
})
export class UploadComponent implements OnInit {

  public errorfile: Error;
  public errormsg: Error;
  public fileError: any = "";
  public res: any;
  public stations: Station[];
  private fileProcessed = true;
  public fileIsProcessing = false;
  public fileIsProcessed = false;
  public isEncrypted = false;
  public message: Message ;
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
  public test: any;
  public fileid: any;


  constructor(
    private messageService: MessageService, 
    private apiService: ApiService,
    private stationService: StationService,
    private authenticationService: AuthenticationService) {}


handleFile() {
  console.log()
}    

onFileSelected(event) {

  let file:File = event.target.files[0];
  console.log(event)

  if (file) {
    this.file = file;
      this.fileName = file.name;
      return file;
  }
}


sendMessage(f: NgForm): void {
	//TODO set from message and remove
    f.value.text = 'mensagem teste';
    f.value.dest = 'local';

	// File exists? 
	if (this.file != null) {
    	// this.fileIsProcessing = true;
    	this.messageService.postFile(this.file, f.value.pass).then(value => {
			f.value.file = value['id'] ; // gona change  to this default instead of image
			f.value.image = value['id'] ; // this wil gona die, repeated for compatibility
			f.value.filename = value['filename'];
			let filesize =  value['size'] ; // can be use later on frontend to show how compressed the file is
			console.log(value);
			let res  = this.sendMessageContinue(f);
		});
	}
	else{
			let res  = this.sendMessageContinue(f);
    }
}
  sendMessageContinue(f: NgForm){
    this.messageService.sendMessage(f.value,  'localdebughost').subscribe(
    	(res: any) => {
    		this.res = res;
    		console.log('⚚ messagecompose - sendMessage: res: ', res);
    		// this.fileIsProcessing = true;
    	},
    	 (err) => {
    	 	this.errormsg = err;
    	 	this.errorAlert = true;
    	 }
    	);
	}

  ngOnInit(): void {
  }

}