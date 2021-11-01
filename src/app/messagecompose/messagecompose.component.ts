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
  public file: any;
  public errorfile: any;
  public fileName: any;
  public errormsg: any;
  public test: any;
  public fileid: any;
  public fileSelected: boolean = false;
  public sending: boolean = false;
  public nodename: any;

  //allowfile : users, admin, all


  /*public message:Message = {
    id: null,
    name: '',
    orig: '',
    dest: '',
    text: '',
    file: '',
    fileid: '',
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
        this.nodename = res.nodename;
        //console.log('messagecompose' , this.currentUser);
        //console.log('hahaha', this.serverConfig)


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

  sendMessag(f: NgForm, passwd): void {
      this.fileIsProcessing = true;
	  f.value.orig = this.nodename;
      console.log(passwd)
      this.messageService.sendMessage(f.value,  this.serverConfig.nodename).subscribe(
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

  onFileSelected(event) {

    let file:File = event.target.files[0];
    console.log(event)
  
    if (file) {
        
      //comparador de tamanho;
  
      if(file.size < 9145728) {
  
        this.file = file;
        this.fileName = file.name;
        console.log(file);
        this.fileSelected = true;
        return file;
      }
      else {
        this.fileName = "file too big";
      }
    }
  }

  removeFile() {
    let file = [];
    this.fileName = '';
    this.file = [];
    this.fileSelected = false;
    return this.file;
  }

  async sendMessage(f: NgForm): Promise<void> {

    //turn on animation
    this.sending = true;


    // File exists? 
    if (this.file != null && this.file !== [] ) {
      await this.messageService.postFile(this.file, f.value.pass).then(value => {
        f.value.file = value['filename'] ; // gona change  to this default instead of image
        f.value.fileid = value['id'];
        let filesize =  value['size'] ; // can be use later on frontend to show how compressed the file is
        this.sending = false;
        console.log(value);
        let res  = this.sendMessageContinue(f);
      });
    }
    else{
        let res  = this.sendMessageContinue(f);
        this.sending = false;
      }
    }

    sendMessageContinue(f: NgForm){
      this.sending = false;
  
      this.messageService.sendMessage(f.value,  this.nodename).subscribe(
        (res: any) => {
          this.res = res;
          console.log('⚚ messagecompose - sendMessage: res: ', res);
          this.fileIsProcessing = true;
        },
         (err) => {
           this.errormsg = err;
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

  fileUpload(files): void{
    // this.messageService.postFile($files[0]);
    console.log('⚚ messagecompose - fileupload: ', files);
    // this.messageService.postFile(files[0]).subscribe(
    //   (res: any) => {
    //     this.message.file = res.filename;
    //     this.message.image = res.timestamp;
	// 	console.log(this.message);
    //   },
    //   (err) => {
    //     this.fileError = err;
    //     this.errorAlert = true;
    //   }
    // );
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
      fileid: '',
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