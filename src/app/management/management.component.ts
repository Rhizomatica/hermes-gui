import { Component, OnInit } from '@angular/core';
import { NgForm} from '@angular/forms';
import { User } from '../user';
import { UserService } from '../_services/user.service';
import { Station } from '../station';
import { StationService } from '../_services/station.service';
import { AuthenticationService } from '../_services/authentication.service';
import { ApiService } from '../_services/api.service';


@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less']
})

export class ManagementComponent implements OnInit {

  currentUser: User;
  searchUser: string;
  error = Error;
  success = '';
  users: User[];
  stations: Station[];
  selectedUser: User[];
  control: any;
  isadmin = false;
  isEditing = false;
  deleteUser = false;
  newUsername = false;
  emptyUser = false;
  searchMessages: string;
  errorAlert = false;
  passMatch = false;
  passunMatch = false;
  passMin = false;
  repasswd: any;
  system: any;
  updateUser = false;

  constructor(
      private userService: UserService,
      private stationService: StationService,
      private authenticationService: AuthenticationService,
      private apiService: ApiService
    )
    {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }

    getSystemStatus(): void{
      this.apiService.getStatus().subscribe(
        (res: any) => {
          this.system = res;
          return res;
        },
        (err) => {
          this.error = err;
        }
      );

      // console.log('system:', this.system);
    }

  loggedin() {
    if (this.isadmin) {
      this.isadmin = false;
    } else {
      this.isadmin = true;
    }
  }

  Alert(param, ): boolean {
      // param=!param;
      return !param;
   }


   checkpass(passwd, repasswd) {
    // let passwd = (<HTMLInputElement>document.getElementById("pass")).value;
    // let repasswd = (<HTMLInputElement>document.getElementById("repass")).value;
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
      // console.log("pass: ", this.passMatch);
      // console.log(passwd, repasswd);
      // console.log(this.passwd, this.repasswd);

    } else {
      this.passMin = true;
      this.passunMatch = false;

    }
  }

   closeError() {
    this.errorAlert = false;
  }

  deleteAlert() {
    if (this.deleteUser) {
      this.deleteUser = false;
    } else {
      this.deleteUser = true;
    }
   }

   updateAlert() {
    if (this.updateUser) {
      this.updateUser = false;
      this.emptyUser = false;
    } else {
      this.updateUser = true;
      this.emptyUser = false;
    }
   }

   cancelCreate() {
    this.isEditing = false;
   }

   newUser() {
     if (this.currentUser) {
       this.isadmin = this.currentUser.admin;
     } else {
       this.isadmin = false;
     }
     this.selectedUser = [];
     // opens the user edit form
     this.isEditing = true;
     // for showing the username input
     this.newUsername = true;
     this.emptyUser = true;
     this.updateUser = false;
     // for showing the delete button
     this.deleteUser = false;
     console.log ('object', this.selectedUser);
   }


  getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;
        console.log('⚚ management - getUsers');
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  onSelect(user): void {
    this.selectedUser = user;
    this.isEditing = true;
    // console.log('⚚ management - onSelect: isEditing? ', this.isEditing);
    this.emptyUser = false;
    // console.log('⚚ management - onSelect: isEditing? ', this.selectedUser);

  }

  onSubmitUpdate(id: number, f: NgForm): void {
    // console.log('sel', this.selectedUser);
    this.userService.updateUser(id, f.value).subscribe(
      (res: any) => {
        this.users = res;
        this.getUsers();
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;

      }
    );
    this.selectedUser = [];
    this.updateUser = false;
    this.isEditing = false;
  }

  onSubmitDelete( id: number, email:string ): void {
      this.userService.deleteUser(id, email).subscribe();
      this.deleteUser = false;
      this.isEditing = false;
      // window.location.reload();
  }

  async onSubmitCreate(f: NgForm): Promise<void> {
    f.value.location = 'local';
    await this.userService.createUser(f.value).subscribe();
    this.isEditing = false;
    this.users = [];
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;
        console.log('⚚ management - getUsers');
        this.getUsers();
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
    this.getUsers();

  }

  ngOnInit(): void {
    this.getUsers();
    this.getSystemStatus();
    this.stationService.getStations()
    .subscribe(stations =>  this.stations = stations);
    if (this.currentUser) {
    this.isadmin = this.currentUser.admin;
    } else {
      this.isadmin = false;
    }


  }
}
