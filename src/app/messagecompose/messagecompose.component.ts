import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Message } from '../message';
import { MessageService } from '../_services/message.service';
import { Station } from '../station';
import { StationService } from '../_services/station.service';
import { ApiService } from '../_services/api.service';
import { AuthenticationService } from '../_services/authentication.service';

// import { GlobalConstants } from '../global-constants';

@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})


export class MessagecomposeComponent implements OnInit {

  public error: any;
  public fileError: any;
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
  public currentUser: any;
  public isLoggedIn: boolean;
  public isAdmin: boolean = false;

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
        console.log(this.currentUser);

        switch(this.allowfile) {
          case 'users':
            if (this.currentUser) {
              this.allowUpload = true;
            } else {   
            }
            //console.log('haha');  
            break;
            case 'admin':
            if (this.isAdmin) {
              this.allowUpload = true;
            }  
            //console.log('huhu');
            break; 
            case 'all': 
            this.allowUpload = true;
            //console.log('yeyey');
            break;
            default: 
            this.allowUpload = false;
            //console.log('sorry');
          }


        return res;
      },
      (err) => {
        this.error = err;
      }
    );
  }

  setFileUpload(): any {
    
    
  }

  sendMessage(f: NgForm, passwd): void {
      this.fileIsProcessing = true;
      console.log(passwd)
      this.messageService.sendMessage(f.value,  this.message.file, this.message.id).subscribe(
      (res: any) => {
        this.res = res;
        console.log('⚚ messagecompose - sendMessage: res: ', res);
        // this.fileIsProcessing = true;
      },
      (err) => {
        this.error = err;
      }
    );
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
    
    if (passwd == repasswd) {
      this.passMatch = true;
    } else {
      this.passMatch = false
    }
    console.log("passMatch: ", this.passMatch);
  }

  retry() {
    this.error = false;
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
