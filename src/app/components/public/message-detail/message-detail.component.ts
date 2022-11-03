import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../_services/message.service';
import { GlobalConstants } from '../../../global-constants';
import { NgForm } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { ApiService } from '../../../_services/api.service';
import { AuthenticationService } from '../../../_services/authentication.service';
// import { ScriptService } from '../../../_services/script.service';

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
  url = GlobalConstants.apiURL;
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
  deleteMessage = false;
  selectedMessage: Message
  errorAlert = false
  loading = false

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private location: Location,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    // private scripts: ScriptService,

  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  changeEnc() {
    if (this.isEncrypted) {
      this.isEncrypted = false;
    } else {
      this.isEncrypted = true;
    }
  }

  getMessageOld(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessage(id).subscribe(message => this.message);
  }

  sendPassword(id: number, f: NgForm): void {
    this.messageService.uncrypt(id, f.value).subscribe(
      (res: any) => {
        if (res.text !== '') {
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
    if (this.audioLoading)
      this.audioLoading = false
  }

  getMessage(): void {
    this.loading = true
    const id = +this.route.snapshot.paramMap.get('id');
    const file = +this.route.snapshot.paramMap.get('file');
    const mime = '';
    this.messageService.getMessage(id).subscribe(
      (res: any) => {
        this.message = res;
        if (this.message.file === '') {
          this.noImage = true;
        } else {
          switch (this.message.mimetype) {
            //TODO - Separar (levar para utils)
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

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.noMessage = true;
        this.loading = false
      }
    );
  }

  getMessageImage(): void {
    this.loading = true
    const id = +this.route.snapshot.paramMap.get('id');
    this.messageService.getMessageImage(id).subscribe(
      (res: any) => {
        this.messageImage = res;
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.noImage = true;
        this.loading = false
      }
    );
  }

  getSysConfig(): void {
    this.apiService.getSysConfig().subscribe(
      (res: any) => {
        this.serverConfig = res;
        this.allowhmp = res.allowhmp;
        this.checkHmp();
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.allowCompose = false;
      }
    );
  }

  checkHmp() {
    switch (this.allowhmp) {
      case 'users':
        if (this.currentUser) {
          this.allowCompose = true;
        } else {
          this.allowCompose = false;
        }
        break;
      case 'admin':
        if (this.currentUser) {
          if (this.currentUser.admin) {
            this.allowCompose = true;
          } else {
            this.allowCompose = false;
          }
        } else {
          this.allowCompose = false;
        }
        break;
      case 'all':
        this.allowCompose = true;
        break;
      default:
        this.allowCompose = false;
    }
    return this.allowCompose;
  }

  showDelete(message) {
    this.selectedMessage = message
    if (this.deleteMessage) {
      this.deleteMessage = false;
    } else {
      this.deleteMessage = true;
    }
  }

  deleteThisMessage() {
    this.deleteMessage = false
    this.loading = true
    this.messageService.deleteMessage(this.message.id).subscribe(
      (res: any) => {
        this.message = res;
        this.deleteMessage = false;
        this.selectedMessage = null
        this.loading = false
        history.back()
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.deleteMessage = false;
        this.selectedMessage = null
        this.loading = false
      }
    );
  }

  closeError() {
    this.errorAlert = false;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getMessage();
    this.getSysConfig();
  }

}
