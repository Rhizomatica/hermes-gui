import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../_services/message.service';
import { Station } from '../../../interfaces/station';
import { StationService } from '../../../_services/station.service';
import { ApiService } from '../../../_services/api.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { FrequencyService } from '../../../_services/frequency.service';
import { User } from '../../../interfaces/user';
import { Router, ActivatedRoute } from '@angular/router';
import { Frequency } from 'src/app/interfaces/frequency';
import { GlobalConstants } from '../../../global-constants';

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
  public isGateway: boolean = GlobalConstants.gateway
  public selectedStations = [];
  public allowhmp;
  public allowCompose = false;
  public camPicture: any;
  public loading = true
  public mobile: any
  public webCamDesktop = false
  public WIDTH = 640;
  public HEIGHT = 480;
  public audioRecorderOverall = false
  public frequencies: Frequency[]
  fileSizeError: boolean = false

  @ViewChild("canvas")
  public canvas: ElementRef;

  @ViewChild("video")
  public video: ElementRef;

  constructor(
    private messageService: MessageService,
    private apiService: ApiService,
    private stationService: StationService,
    private authenticationService: AuthenticationService,
    private frequencyService: FrequencyService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {
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


  onFileCamSelected(e) {
    this.camPicture = e.target.files[0]
    this.onFileSelected(e)
  }

  async openWebCamDesktop() {
    this.webCamDesktop = true
    this.dataURItoBlob(this.canvas.nativeElement.toDataURL("image/png"));

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true
        });
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
          var base_image = new Image();
          base_image.src = "../assets/svg/smile-regular.svg";

          base_image.onload = () => {
            this.drawImageToCanvas(base_image)
          }

        }
        //  else {
        //   this.error = "You have no output video device";
        // }
      } catch (e) {
        this.error = e;
      }
    }
  }

  isMobile() {
    return navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)
  }

  capture(e) {
    this.drawImageToCanvas(this.video.nativeElement)
    this.dataURItoBlob(this.canvas.nativeElement.toDataURL("image/png"));
    this.fileSelected = true
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
      byteString = atob(dataURI.split(',')[1]);
    else
      byteString = unescape(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //TODO - formato da imagem com problema para envio
    //TODO - Já seta so de abrir a webcam não deveria setar (usar outra variavel?)
    this.file = new Blob([ia], { type: mimeString })
    this.fileName = window.URL.createObjectURL(this.file)
  }

  drawImageToCanvas(image: any) {
    this.canvas.nativeElement.getContext('2d')
      .drawImage(image, 0, 0, this.WIDTH, this.HEIGHT);
  }

  audFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      const audSrc = URL.createObjectURL(event.target.files[0]);
      // this.figAudio.nativeElement.src = this.audSrc;
    }
  }

  onFileSelected(event) {
    let file: File = event.target.files[0];
    if (file) {
      this.file = file;
      switch (this.file.type) {
        case 'image/bmp':
        case 'image/gif':
        case 'image/jpeg':
        case 'image/png':
        case 'image/webp':
        case 'image/svg+xml':
        case 'image/pjpeg':
        case 'image/x-jps':
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
          this.maxSize = 31457280;
          break;
        default:
          this.maxSize = 2097152;
      }
      if (file.size < this.maxSize) {
        this.fileName = file.name;
        this.fileSelected = true;
        this.fileSizeError = false
        return file;
      }
      else {
        this.fileName = ' - ';
        this.fileSizeError = true
        this.file = null;
        file = null;
        return file;
      }
    }
  }

  removeFile() {
    this.fileName = '';
    this.file = null;
    this.fileSelected = false;
    this.isEncrypted = false
    return this.file;
  }

  async sendMessage(f: NgForm): Promise<void> {
    //turn on animation
    this.sending = true;
    this.loading = true;

    if (!this.isGateway) {
      var str = f.value.dest;
      var arr = [];
      arr.push(str);
      f.value.dest = arr;
    }
    // File exists?
    if (this.file) {
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
          this.loading = false;
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
        this.loading = false;
        this.router.navigate(['/sent']);
      },
      (err) => {
        this.errormsg = err;
        this.errorAlert = true;
        this.loading = false;
      }
    );
  }

  closeError() {
    this.errorAlert = false;
  }

  closeWebCamDesktop() {
    this.webCamDesktop = false
  }
  // TODO check to remove
  newMessage() {
    // this.router.navigate(['/compose']);
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
  }

  selectAllForDropdownItems(items: any[]) {
    let allSelect = items => {
      items.forEach(element => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };

    allSelect(items);
  }

  audioRecorder() {
    this.audioRecorderOverall = true
  }

  closeaudioRecorder() {
    this.audioRecorderOverall = false
  }

  addFileItemEmitted(event) {
    this.file = event
    if (this.file) {
      this.fileSelected = true;
      this.fileName = URL.createObjectURL(this.file)
      return
    }

    this.errorCallback
  }

  errorCallback(error) {
    this.audioRecorderOverall = false
    this.errorAlert = true
    this.errormsg = 'Can not play audio in your browser';
  }

  getAliasOrigin(originName) {
    if (!originName)
      return null

    return this.stations.filter((a) => { return a.name === originName })[0].alias
  }

  public getFrequencies(): void {
    this.loading = true
    this.frequencyService.getFrequencies().subscribe(
      (data: any) => {
        this.frequencies = data;
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false;
      }
    );
  }

  getNickName(stations): void {
    stations.forEach(station => {
      this.frequencies.forEach(frequency => {
        if (station.alias === frequency.alias && frequency.nickname != null)
          station.nickname = " - " + frequency.nickname
      })
    })
  }

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

    this.mobile = this.isMobile()
    this.getSysConfig();
    this.getFrequencies();
    this.isEncrypted = false;
    this.fileIsProcessing = false;
    this.stationService.getStations()
      .subscribe(stations => {
        this.stations = stations;
        
        if (this.stations.length > 0) {
          this.selectedStations = [this.stations[0].id];
          this.selectAllForDropdownItems(this.stations);

          var origin = this.getAliasOrigin(this.activatedRoute.snapshot.paramMap.get("origin"))

          this.message.dest = origin !== null ? [origin] : []
        }

        this.loading = false

        this.getNickName(stations)
      });
  }

}
