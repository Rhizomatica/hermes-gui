import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../_services/message.service';
import { AlertService } from '../../../_services/alert.service';
import { User } from '../../../interfaces/user';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { UtilsService } from 'src/app/_services/utils.service';
import { Station } from 'src/app/interfaces/station';
import { StationService } from 'src/app/_services/station.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})

export class MessagesComponent implements OnInit {

  currentUser: User;
  error = Error;
  inboxMessages: Message[];
  message: Message;
  selectedMessage: Message;
  isadmin = false;
  searchMessages: string;
  noMessages = false;
  allowCompose = false;
  allowhmp = 'root';
  serverConfig: any;
  loginForm = false;
  deleteMessage = false;
  errorAlert = false;
  loading = true;
  public stations: Station[];

  constructor(
    private messageService: MessageService,
    private alertService: AlertService,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private stationService: StationService,
    private utils: UtilsService) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('read message: id=$' + message.id);
  }

  getInboxMessages(): void {
    this.loading = true
    this.messageService.getMessagesByType('inbox').subscribe(
      (res: any) => {
        this.inboxMessages = res.sort((a, b) => { return new Date(a.sent_at) < new Date(b.sent_at) ? 1 : -1; });

        if (this.inboxMessages.length == 0) {
          this.noMessages = true;
        } else {
          this.inboxMessages = this.inboxMessages.filter((a) => { return a.sent_at = this.utils.formatDate(a.sent_at) })
          this.noMessages = false;
        }

        this.getAliasOrigin()

        this.loading = false
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  getAliasOrigin() {
    this.inboxMessages.forEach(item => {
      item.orig = this.stations.filter((a) => { return a.name === item.orig })[0].alias
    })
  }

  showDelete() {
    if (this.deleteMessage) {
      this.deleteMessage = false;
    } else {
      this.deleteMessage = true;
    }
  }

  selectMessage(message: Message): void {
    this.selectedMessage = message;
  }

  // deleteInboxMessage($id): void {
  //   this.inboxMessages = this.inboxMessages.filter(obj => obj !== this.message);
  //   this.messageService.deleteMessage($id).subscribe(
  //     (res: any) => {
  //       this.message = res;
  //       this.getInboxMessages();
  //       this.loading = false
  //     },
  //     (err) => {
  //       this.error = err;
  //       this.errorAlert = true;
  //       this.loading = false
  //     }
  //   );
  //   this.deleteMessage = false;
  // }


  deleteThisMessage() {
    this.loading = true
    let msgId = 0;
    msgId = this.selectedMessage.id;
    this.messageService.deleteMessage(msgId).subscribe(
      (res: any) => {
        this.message = res;
        this.getInboxMessages();
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
    this.deleteMessage = false;
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
        this.allowCompose = false;
        this.errorAlert = true;
      }
    );
  }

  showlogin() {
    if (this.loginForm) {
      this.loginForm = false;
    } else {
      this.loginForm = true;
    }
  }

  closeLogin() {
    this.getSysConfig();
    this.loginForm = false;
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.checkHmp();
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

  logout() {
    this.authenticationService.logout();
    this.currentUser = null;
    this.checkHmp();
  }

  closeError() {
    this.errorAlert = false;
  }

  getStations() {
    this.stationService.getStations().subscribe(stations => {
      this.stations = stations

      this.getInboxMessages()
      this.getSysConfig()
    });
  }

  ngOnInit(): void {
    this.getStations()

    if (this.currentUser) {
      this.isadmin = this.currentUser.admin
    } else {
      this.isadmin = false
    }
  }
}
