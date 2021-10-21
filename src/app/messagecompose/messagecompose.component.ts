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
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']

})


export class MessagecomposeComponent implements OnInit {

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

  //allowfile : users, admin, all


  /*public message:Message = {
    id: null,
    name: '',
    orig: '',
    dest: '',
    text: '',
    file: '',
    draft: null,
    sent_at: '',  
    secure: boolean;

  }*/

  constructor(
    private messageService: MessageService, 
    private apiService: ApiService,
    private stationService: StationService,
    private authenticationService: AuthenticationService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      if (this.currentUser) {
        this.isAdmin =  this.currentUser.admin;
      }
      
    }


  getSysConfig(): void{
    this.apiService.getSysConfig().subscribe(
      (res: any) => {
        this.serverConfig= res;
        this.allowfile = res.allowfile;
        console.log('messagecompose' , this.currentUser);

        switch(this.allowfile) {
          case 'users':
            if (this.currentUser) {
              this.allowUpload = true;
            }    
            break;
            case 'admin':
            if (this.currentUser) {
            	if (this.isAdmin) {
              	this.allowUpload = true;
            	}
            }
            break; 
            case 'all': 
            this.allowUpload = true;
            break;
            default: 
            this.allowUpload = false;
          }
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.allowUpload = false;
      }
    );
  }

  setFileUpload(): any {
    
    
  }

  sendMessage(f: NgForm, passwd): void {
      this.fileIsProcessing = true;
      console.log(passwd)
      this.messageService.sendMessage(f.value,  this.message.file, this.message.id, this.serverConfig.host).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ messagecompose - sendMessage: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  closeError() {
    this.errorAlert = false;
  }

  //TODO check to remove
  newMessage() {
    // this.router.navigate(['/compose']);
    this.fileIsProcessing = false;
    this.message.name = '';
    this.message.text = '';
    this.message.file = '';
        console.log('⚚ message-detail - newMessage - TODO yeah! ', this.message);

  }

  messageList() {
    // this.router.navigate(['/compose']);

  }

  encrypted() {
    if (this.isEncrypted) {
      this.isEncrypted = false;
    } else {
      this.isEncrypted = true;
    }
    // console.log('⚚ messages - delete id: ', this.isEncrypted);
  }

  
  checkpwd(passwd,repasswd) {
    //let passwd = (<HTMLInputElement>document.getElementById("pass")).value;
    //let repasswd = (<HTMLInputElement>document.getElementById("repass")).value;
    if (passwd) {
      if (passwd == repasswd) {
        this.passMatch = true;
        this.passMin = false;
        this.passunMatch = false;
      } else {
        this.passMatch = false;
        this.passMin = false;
        this.passunMatch = true;
      }
      console.log("passMatch: ", this.passMatch);
      //console.log(this.passwd, this.repasswd);

    } else {
      this.passMin = true;
      this.passunMatch = false;

    }

    
  }

 

  DocUpload(files): void{
    // this.messageService.postFile($files[0]);
    console.log('⚚ messagecompose - docUpload ', files);
    this.messageService.postFile(files[0]).subscribe(
      (res: any) => {
        this.message.id = res[2];
        this.message.file = res[1];
      },
      (err) => {
        this.fileError = err;
        this.errorAlert = true;
      }
    );
  }

  // TODO double check start params on inbox
  ngOnInit(): void {
    this.message = {
      id: null,
      name: '',
      orig: '',
      dest: '',
      text: '',
      file: '',
      image: '',
      audio: '',
      secure: false,
      inbox: false,
      draft: null,
      sent_at: '',
      created_at: '',
      updated_at: '',
    };

    this.getSysConfig();

    this.isEncrypted = false;
    this.fileIsProcessing = false;
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);
  }

}
