import { Component, OnInit } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../_services/message.service';
import { Station } from '../../../interfaces/station';
import { StationService } from '../../../_services/station.service';
import { ApiService } from '../../../_services/api.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { User } from '../../../interfaces/user';
import { Utils } from '../../../components/utils/utils';

@Component({
  selector: 'app-messagecompose',
  templateUrl: './messagecompose.component.html',
  styleUrls: ['./messagecompose.component.less']
})

export class MessagecomposeComponent implements OnInit {

  public error: Error;
  public fileError: any = '';
  public res: any;
  public stations: Station[];
  public fileIsProcessing = false;
  public fileIsProcessed = false;
  public isEncrypted = false;
  public message: Message;
  public passMatch = false;
  public passwd;
  public repasswd;
  public serverConfig: any;
  public allowfile: any;
  public allowUpload = false;
  public currentUser: User;
  public isAdmin = false;
  public passunMatch = false;
  public passMin = false;
  public errorAlert = false;
  public file: any;
  public fileName: any;
  public errormsg: any;
  public fileid: any;
  public fileSelected = false;
  public sending = false;
  public nodename: any;
  public maxSize: any = 31457280;
  public isGateway: boolean;
  public system: any;
  public selectedStations = [];
  public allowhmp;
  public allowCompose = false;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private stationService: StationService,
    private authenticationService: AuthenticationService,
    private utils: Utils) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser) {
      this.isAdmin = this.currentUser.admin;
    }
  }

  getSysConfig(): void {
    this.apiService.getSysConfig().subscribe(
      (res: any) => {
        this.serverConfig = res;
        this.allowfile = res.allowfile;
        this.allowhmp = res.allowhmp;
        this.nodename = res.nodename;

        switch (this.allowfile) {
          case 'users':
            if (this.currentUser) {
              this.allowUpload = true;
            } else {
              this.allowUpload = false;
            }
            break;
          case 'admin':
            if (this.currentUser) {
              if (this.isAdmin) {
                this.allowUpload = true;
              } else {
                this.allowUpload = false;
              }
            } else {
              this.allowUpload = false;
            }
            break;
          case 'all':
            this.allowUpload = true;
            break;
          default:
            this.allowUpload = false;
        }
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
              if (this.isAdmin) {
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

        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.allowUpload = false;
      }
    );
  }

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        this.isGateway = this.system.gateway;
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  onFileSelected(event) {
    let file: File = event.target.files[0];

    if (file) {
      this.file = file;
      this.maxSize = this.utils.getMaxSizeFileByType(this.file.type)
    }

    if (file.size < this.maxSize) {
      this.fileName = file.name;
      this.fileSelected = true;
      return file;
    }
    else {
      this.fileName = 'file too big | archivo muy grande ';
      this.file = null;
      file = null;
      return file;
    }
  }

  removeFile() {
    const file = null;
    this.fileName = '';
    this.file = null;
    this.fileSelected = false;
    return this.file;
  }

  async sendMessage(f: NgForm): Promise<void> {
    //turn on animation
    this.sending = true;

    if (!this.isGateway) {
      var str = f.value.dest;
      var arr = [];
      arr.push(str);
      f.value.dest = arr;
    }
    // File exists?
    if (this.file != null && this.file !== []) {
      await this.messageService.postFile(this.file, f.value.pass).then(

        (value: any) => {
          f.value.file = value['filename']; // gona change  to this default instead of image
          f.value.fileid = value['id'];
          f.value.mimetype = value['mimetype'];
          const filesize = value['size']; // can be use later on frontend to show how compressed the file is
          this.sending = false;
          const res = this.sendMessageContinue(f);
        },
        (err) => {
          this.errormsg = err;
          this.errorAlert = true;
          this.sending = false;
        }
      );
    }
    else {
      const res = this.sendMessageContinue(f);
      this.sending = false;
    }
  }

  sendMessageContinue(f: NgForm) {
    this.sending = false;

    this.messageService.sendMessage(f.value, this.nodename).subscribe(
      (res: any) => {
        this.res = res;
        this.fileIsProcessing = true;
        this.file = [];
        this.fileName = '';
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

  // TODO check to remove
  newMessage() {
    this.fileIsProcessing = false;
    this.message.name = '';
    this.message.text = '';
    this.message.file = '';
  }

  encrypted() {
    if (this.isEncrypted) {
      this.isEncrypted = false;
    } else {
      this.isEncrypted = true;
    }
  }

  checkpwd(passwd, repasswd) {
    if (passwd) {
      if (passwd === repasswd) {
        this.passMatch = true;
        this.passMin = false;
        this.passunMatch = false;
      } else {
        this.passMatch = false;
        this.passMin = false;
        this.passunMatch = true;
      }
    } else {
      this.passMin = true;
      this.passunMatch = false;
    }
  }

  fileUpload(files): void {
    // this.messageService.postFile($files[0]);
    console.log('⚚ messagecompose - fileupload: ', files);
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  // TODO double check start params on inbox
  ngOnInit(): void {
    this.message = {
      id: null,
      name: '',
      orig: '',
      dest: [],
      text: '',
      file: '',
      fileid: '',
      secure: false,
      inbox: false,
      draft: null,
      sent_at: '',
      created_at: '',
      updated_at: '',
      mimetype: ''
    };

    this.getSysConfig();
    this.getSystemStatus();
    this.isEncrypted = false;
    this.fileIsProcessing = false;
    this.stationService.getStations()
      .subscribe(stations => {
        this.stations = stations;
        this.selectedStations = [this.stations[0].id];
        this.selectAllForDropdownItems(this.stations
        );
      });
  }

}
