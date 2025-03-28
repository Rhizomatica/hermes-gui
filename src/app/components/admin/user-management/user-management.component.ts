import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../_services/user.service';
import { Station } from '../../../interfaces/station';
import { StationService } from '../../../_services/station.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { ApiService } from '../../../_services/api.service';
import { GlobalConstants } from '../../../global-constants';

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
  updateUser = false;
  showPassword = false;
  loading = true
  flagAdmin = false
  fullNameEmpty = false
  domain: String = GlobalConstants.domain
  errorUserAlreadyExist = false
  selectedUserEmail = null

  constructor(
    private userService: UserService,
    private stationService: StationService,
    private authenticationService: AuthenticationService,
    private apiService: ApiService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.flagAdmin = this.currentUser.admin
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

        if (passwd.length < 6) {
          this.passMin = true
        }

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

  checkFullName(fullName) {
    this.fullNameEmpty = fullName && fullName.length > 0 ? false : true
  }

  closeError() {
    this.errorAlert = false;
    this.errorUserAlreadyExist = false;
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
    this.newUsername = false;
    this.fullNameEmpty = false;
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
    this.selectedUser = null

    if (!this.isadmin && this.currentUser.email !== user.email)
      return

    this.selectedUser = user;
    this.selectedUserEmail = user.email
    this.isEditing = true;
    this.showPassword = false
    this.emptyUser = false;
  }

  onSubmitUpdate(id: number, f: NgForm): void {
    this.loading = true

    if(!f.value.email)
      f.value.email = this.selectedUserEmail

    if(!f.value.admin)
        f.value.admin = false

    this.userService.updateUser(id, f.value).subscribe(
      (res: any) => {
        // this.users = res;
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
    this.loading = true
    this.userService.deleteUser(id, email).subscribe(
      (res: any) => {
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
    await this.userService.createUser(f.value).subscribe(
      (res: any) => {
        this.getUsers();
        this.isEditing = false;
        this.loading = false
      },(err) => {
        this.loading = false
        this.errorAlert = true;
        if (err == 409) {
          this.errorUserAlreadyExist = true
        }
      }
    );
  }

  changeAdmin($event: Event) {
    $event.preventDefault()

    if (this.flagAdmin)
      this.flagAdmin = false
    else
      this.flagAdmin = true

  }

  ngOnInit(): void {
    this.getUsers();
    this.stationService.getStations()
      .subscribe(stations => this.stations = stations);
    if (this.currentUser) {
      this.isadmin = this.currentUser.admin;
    } else {
      this.isadmin = false;
    }
  }
}
