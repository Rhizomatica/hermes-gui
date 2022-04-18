import { Component, OnInit, Input } from '@angular/core';
import { Message } from '../../../interfaces/message';
import { MessageService } from '../../../_services/message.service';
import { AlertService } from '../../../_services/alert.service';
import { User } from '../../../interfaces/user';
// import { GlobalConstants } from '../global-constants';
import { UserService } from '../../../_services/user.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';


export interface MessageInbox {
  id: number;
  searchMessages: string;
  name: string;
  orig: string;
  dest: string;
  text: string;
  file: string;
  draft: boolean;
  // crypt: boolean;
  sent_at: string;

}
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.less']
})
export class MessagesComponent implements OnInit {

// @Input() message: Message;
  currentUser: User;
  error = Error;
  success = '';
  test = '';
  inboxMessages: Message[];
  message: Message;
  selectedMessage: Message;
  isadmin = false;
  searchMessages: string;
  today = Date();
  noMessages = false;
  allowCompose = false;
  allowhmp = 'root';
  serverConfig: any;
  loginForm = false;
  deleteMessage = false;

  constructor(
    private messageService: MessageService,
    private alertService: AlertService,
    private apiService: ApiService,
    private authenticationService: AuthenticationService,
    private userService: UserService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

  onSelect(message: Message): void {
    this.selectedMessage = message;
    this.alertService.add('read message: id=$' + message.id);
  }

  getInboxMessages(): void {
    this.messageService.getMessagesByType('inbox').subscribe(
      (res: any) => {
        this.inboxMessages = res;
        this.inboxMessages = this.inboxMessages.sort((a, b) => { return a.created_at < b.created_at ? 1 : -1; });
        if (this.inboxMessages.length == 0) {
          this.noMessages = true;
        } else {
          this.noMessages = false;
        }
        // console.log(this.inboxMessages);
     },
      (err) => {
        this.error = err;
      }
    );
  }

  

  getInboxMessage($id): void {
      this.messageService.getInboxMessage($id).subscribe(
      (res: any) => {
        this.message = res;
      },
      (err) => {
        this.error = err;
        this.noMessages = true;
      }
    );
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
    console.log(this.selectedMessage);
  }

  deleteInboxMessage($id): void {
    console.log('⚚ messages - delete id: ', $id);
    this.inboxMessages = this.inboxMessages.filter(obj => obj !== this.message);
    this.messageService.deleteMessage($id).subscribe(
      (res: any) => {
        this.message = res;
        // console.log('⚚ messages - deleteInboxMessage -  res: ', res);
        this.getInboxMessages();
        this.deleteMessage = false;
      },
      (err) => {
        this.error = err;
        this.deleteMessage = false;
        // console.error (err);
      }
    );
    this.deleteMessage = false;
  }


  deleteThisMessage() {
    let msgId = 0;
    msgId = this.selectedMessage.id;
    console.log(msgId);
    console.log(this.selectedMessage);
    this.messageService.deleteMessage(msgId).subscribe(
      (res: any) => {
        this.message = res;
        // console.log('⚚ messages - deleteInboxMessage -  res: ', res);
        this.getInboxMessages();
        this.deleteMessage = false;
      },
      (err) => {
        this.error = err;
        this.deleteMessage = false;
        // console.error (err);
      }
    );
    // this.deleteMessage = false;
    //this.getInboxMessages();
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
        console.log('user:', this.currentUser);
      }
      
    );
    
  }

  showlogin() {
    if (this.loginForm) {
      this.loginForm = false;
      console.log(this.loginForm)
    } else {
      this.loginForm = true;
    }

  }

  closeLogin() {
    console.log("closed");
    this.getSysConfig();
    this.loginForm = false;
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    console.log('user:', this.currentUser);
    this.checkHmp();
    
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

  logout() {
    this.authenticationService.logout();
    this.currentUser = null;
    console.log('⚚ app: user logout');
    console.log('⚚ app: user logout', this.currentUser);
    this.checkHmp();
  
    
  }


  ngOnInit(): void {
    this.getInboxMessages();
    this.getSysConfig();
    
    if ( this.currentUser ) {
    this.isadmin = this.currentUser.admin;
    } else {
     this.isadmin = false;
    }// console.log(this.isadmin);
  }
}
