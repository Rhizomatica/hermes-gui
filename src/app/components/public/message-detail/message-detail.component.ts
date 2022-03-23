import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../_services/message.service';
import { GlobalConstants } from '../../../global-constants';
import { NgForm } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { ApiService } from '../../../_services/api.service';
import { UserService } from '../../../_services/user.service';
import { AuthenticationService } from '../../../_services/authentication.service';



@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.less']
})
export class MessageDetailComponent implements OnInit {

  @Input() message: Message;
  error: Error;
  public messageImage: Blob;
  public isEncrypted = false;
  url =  GlobalConstants.apiURL;
  noMessage = false;
  noImage = false;
  wrongPass = false;
  uncrypted = false;
  isAudio = false;
  isImage = false;
  pass = '';
  passString = '';
  audioLoading = false;
  allowCompose = false;
  currentUser: User;
  allowhmp = 'root';
  serverConfig: any;



  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private location: Location,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private userService: UserService

  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

  }

  changeEnc() {
    if (this.isEncrypted) {
      this.isEncrypted = false;
    } else {
      this.isEncrypted = true;
    }
    console.log('⚚ message-detail - changeEnc: isEncrypted? ', this.isEncrypted);
  }

  getMessageOld(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessage(id).subscribe(message => this.message);
  }

  sendPassword(id: number, f: NgForm): void {
    // console.log(f.value);
    this.messageService.uncrypt(id, f.value).subscribe(
      (res: any) => {
		  if (res.text !== ''){
        this.message.text = res.text;
        this.uncrypted = true;
        this.passString = '?i=' + f.value.pass;
		  }
      else {
        this.uncrypted = false;
        this.wrongPass = true;
        this.passString = '';
      }
      },
      (err) => {
        this.error = err;
      }
    );

  }


  loadingAudio() {
  if (this.audioLoading) {
  this.audioLoading = false;
  // console.log('fdfdgdg');
  } else {
   // console.log('ffffff');
  }

  }

  getMessage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    const file = +this.route.snapshot.paramMap.get('file');
    const mime = '';
    this.messageService.getMessage(id).subscribe(
      (res: any) => {
        this.message = res;
        if (this.message.text === '') {
          this.noMessage = true;
        } else {
          this.noMessage = false;
        }

        if (this.message.file === '') {
          this.noImage = true;
        } else {
          console.log(this.message.mimetype);
          switch (this.message.mimetype) {
            case '':
              this.noImage = true;
              this.isAudio = false;
              break;
            case 'image/bmp':
            case 'image/gif':
            case 'image/jpeg':
            case 'image/png':
            case 'image/tiff':
            case 'image/webp':
            case 'image/svg+xml':
            case 'image/pjpeg':
            case 'image/x-jps':
            this.noImage = true;
            this.isImage = true;
            this.isAudio = false;
            break;
            case 'audio/aac':
            case 'audio/mpeg':
            case 'audio/ogg':
            case 'audio/ogx':
            case 'audio/opus':
            case 'audio/wav':
            case 'audio/x-wav':
            case 'audio/webm':
            case 'audio/3gpp':
            case 'audio/3gpp2':
              this.noImage = false;
              this.isImage = false;
              this.isAudio = true;
              this.audioLoading = true;
              break;
            default:
              this.noImage = false;
              this.isAudio = false;
              this.isImage = false;
          }
        }

        // console.log(this.noMessage);
        // console.log(res);
      },
      (err) => {
        this.error = err;
        this.noMessage = true;
      }
    );
  }

  getMessageImage(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessageImage(id).subscribe(
      (res: any) => {
        this.messageImage = res;
        // console.log('debug componente service ' + res);
      },
      (err) => {
        this.error = err;
        this.noImage = true;
      }
    );

  }

  getImageFromService() {
    // this.isImageLoading = true;
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessageImage(id).subscribe(
      data => {
      this.messageImage = data;
      // this.isImageLoading = false;
    }, error => {
      // this.isImageLoading = false;
      console.log('⚚ message-detail - getImageFromService error ', error);
    });
}

getSysConfig(): void{
  this.apiService.getSysConfig().subscribe(
    (res: any) => {
      this.serverConfig= res;
      this.allowhmp = res.allowhmp;
      this.checkHmp();
    },
    (err) => {
      this.error = err;
      this.allowCompose = false;
      // console.log('user:', this.currentUser);
    }
    
  );
  
}

checkHmp() {
  switch(this.allowhmp) {
    case 'users':
      if (this.currentUser) {
        this.allowCompose = true;
        console.log('allow1:');
      } else {
        this.allowCompose = false;
      }
      break;
      case 'admin':
        if (this.currentUser) {
          if (this.currentUser.admin) {
            this.allowCompose = true;
            console.log('allow2:', this.allowCompose);
          } else {
            this.allowCompose = false;
        }} else {
          this.allowCompose = false;
        }
      break;
      case 'all':
      this.allowCompose = true;
      console.log('allow3:', this.allowCompose);
      break;
      default:
      this.allowCompose = false;
      console.log('allow4:', this.allowCompose);
    }
  return this.allowCompose;

}



  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getMessage();
    this.getSysConfig();

    // this.getImageFromService();
  }

}
