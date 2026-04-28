import { Component, OnInit, Input, Renderer2 } from '@angular/core';
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
import { UtilsService } from 'src/app/_services/utils.service';
import { StationService } from 'src/app/_services/station.service';
import { Station } from 'src/app/interfaces/station';
// import { ScriptService } from '../../../_services/script.service';

@Component({
  selector: 'app-message-detail',
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.less']
})

export class MessageDetailComponent implements OnInit {

  @Input() message!: Message;
  error!: Error;
  public messageImage!: Blob;
  public isEncrypted = false;
  url = GlobalConstants.apiURL;
  wrongPass = false;
  uncrypted = false;
  fileType: string = ''
  noMessage = false;
  pass = '';
  passString = '';
  allowCompose = false;
  currentUser!: User;
  allowhmp = 'root';
  serverConfig: any;
  deleteMessage = false;
  selectedMessage: Message | null = null;
  errorAlert = false;
  loading = false;
  degree: number = 0;
  stations!: Station[];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private location: Location,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private utils: UtilsService,
    private stationService: StationService,
    private renderer: Renderer2

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
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.messageService.getMessage(parseInt(id!)).subscribe({ next: (message) => this.message });
  }

  sendPassword(id: number, f: NgForm): void {
    this.messageService.uncrypt(id, f.value).subscribe({
      next: (res: any) => {
        if (res.message && res.message !== '') {
          this.message.text = res.message;
          this.uncrypted = true;
          this.passString = '?i=' + f.value.pass;
          this.wrongPass = false;
        }
        else {
          this.uncrypted = false;
          this.wrongPass = true;
          this.passString = '';
        }
      },
      error: (err) => {
        this.error = err;
      }
    });
  }

  getMessage(): void {
    this.loading = true
    const id: string | null = this.route.snapshot.paramMap.get('id');
    const file: string | null = this.route.snapshot.paramMap.get('file');
    const mime = '';
    this.messageService.getMessage(parseInt(id!)).subscribe({
      next: (res: any) => {
        this.message = res as Message;
        if (this.message.file === '') {
          this.fileType = ''
        } else {
          this.fileType = this.utils.getFileType(this.message.mimetype)
        }

        this.message.sent_at = this.utils.formatDate(this.message.sent_at)
        this.message.orig = this.stations.filter((a) => { return a.name === this.message.orig })[0].alias

        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.noMessage = true;
        this.loading = false
      }
    });
  }

  getMessageImage(): void {
    this.loading = true
    const id: string | null = this.route.snapshot.paramMap.get('id');
    this.messageService.getMessageImage(parseInt(id!)).subscribe({
      next: (res: any) => {
        this.messageImage = res;
        this.loading = false
      },
      error: (err) => {
        this.error = err;
        this.fileType = '';
        this.loading = false
      }
    });
  }

  getSysConfig(): void {
    this.apiService.getSysConfig().subscribe({
      next: (res: any) => {
        this.serverConfig = res;
        this.allowhmp = res.allowhmp;
        this.checkHmp();
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
        this.allowCompose = false;
      }
    });
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

  showDelete(message: Message) {
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
    this.messageService.deleteMessage(this.message.id).subscribe({
      next: (res: any) => {
        this.message = res as Message;
        this.deleteMessage = false;
        this.selectedMessage = null;
        this.loading = false;
        history.back();
      },
      error: (err) => {
        this.error = err;
        this.errorAlert = true;
        this.deleteMessage = false;
        this.selectedMessage = null
        this.loading = false
      }
    });
  }

  closeError() {
    this.errorAlert = false;
  }

  rotateImage() {
    const image = document.getElementById('image')

    this.degree += 90

    this.renderer.setStyle(
      image,
      'transform',
      `rotate(${this.degree}deg)`
    )

    if (image && image.offsetWidth > image.offsetHeight)
      image.style.width = '400px'
  }

  getStations() {
    this.stationService.getStations().subscribe({
      next: (stations) => {
        this.stations = stations

        this.getMessage()
        this.getSysConfig()
      }
    })
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getStations()
  }

}
