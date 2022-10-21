import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../_services/user.service';
import { Station } from '../../../interfaces/station';
import { StationService } from '../../../_services/station.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.less']
})

export class UserManagementComponent implements OnInit {

  currentUser: User;
  searchUser: string;
  error = Error;
  users: User[];
  stations: Station[];
  selectedUser: User[];
  isadmin = false;
  isEditing = false;
  deleteUser = false;
  newUsername = false;
  emptyUser = false;
  errorAlert = false;
  passMatch = false;
  passunMatch = false;
  passMin = false;
  repasswd: any;
  system: any;
  updateUser = false;
  showPassword = false;
  loading = true
  flagAdmin = false

  constructor(
    private userService: UserService,
    private stationService: StationService,
    private authenticationService: AuthenticationService,
    private apiService: ApiService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.flagAdmin = this.currentUser.admin
  }

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res;
        return res;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
  }

  loggedin() {
    if (this.isadmin) {
      this.isadmin = false;
    } else {
      this.isadmin = true;
    }
  }

  Alert(param,): boolean {
    return !param;
  }

  checkpass(passwd, repasswd) {
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

  closeError() {
    this.errorAlert = false;
  }

  showPasswordField() {
    if (this.showPassword) {
      this.showPassword = false;
    } else {
      this.showPassword = true;
    }
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
    this.showPassword = true;
    // opens the user edit form
    this.isEditing = true;
    // for showing the username input
    this.newUsername = true;
    this.emptyUser = true;
    this.updateUser = false;
    // for showing the delete button
    this.deleteUser = false;
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;
        this.loading = false
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  onSelect(user): void {
    if(!this.isadmin)
        return
        
    this.selectedUser = user;
    this.isEditing = true;
    this.emptyUser = false;
  }

  updateThis() {
    this.onSelect(this.currentUser);
  }

  onSubmitUpdate(id: number, f: NgForm): void {
    this.userService.updateUser(id, f.value).subscribe(
      (res: any) => {
        this.users = res;
        this.getUsers();
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.getUsers();
      }
    );
    this.selectedUser = [];
    this.updateUser = false;
    this.isEditing = false;
  }

  onSubmitDelete(id: number, email: string): void {
    this.userService.deleteUser(id, email).subscribe(
      (res: any) => {
        this.users = res;
        this.getUsers();
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.getUsers();
      }
    );
    this.deleteUser = false;
    this.isEditing = false;
  }

  async onSubmitCreate(f: NgForm): Promise<void> {
    this.loading = true
    f.value.location = 'local';
    await this.userService.createUser(f.value).subscribe();
    this.isEditing = false;
    this.users = [];
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;
        this.getUsers();
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.getUsers();
      }
    );
  }

  changeAdmin($event: Event) {
    $event.preventDefault()

    if(this.flagAdmin)
      this.flagAdmin = false
    else
      this.flagAdmin = true

      console.log(this.flagAdmin)
  }

  ngOnInit(): void {
    this.getUsers();
    this.getSystemStatus();
    this.stationService.getStations()
      .subscribe(stations => this.stations = stations);
    if (this.currentUser) {
      this.isadmin = this.currentUser.admin;
    } else {
      this.isadmin = false;
    }
  }
}
