import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../../interfaces/user';
import { UserService } from '../../../_services/user.service';
import { AuthenticationService } from '../../../_services/authentication.service';
import { GlobalConstants } from '../../../global-constants';

@Component({
  selector: 'app-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.less']
})

export class UserManagementComponent implements OnInit {

  currentUser: User;
  error: any;
  selectedUser: User | null = null;
  isadmin = false;
  deleteUser = false;
  newUsername = false;
  emptyUser = false;
  errorAlert = false;
  passunMatch = false;
  passMin = false;
  repasswd: any;
  updateUser = false;
  showPassword = false;
  loading = true;
  flagAdmin = false;
  fullNameEmpty = false;
  domain: String = GlobalConstants.domain;
  errorUserAlreadyExist = false;
  selectedUserEmail = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  checkpass(passwd, repasswd) {
    if (passwd) {
      if (passwd === repasswd) {
        this.passMin = false;
        this.passunMatch = false;

        if (passwd.length < 6) {
          this.passMin = true;
        }

      } else {
        this.passMin = false;
        this.passunMatch = true;
      }
    } else {
      this.passMin = true;
      this.passunMatch = false;
    }
  }

  checkFullName(fullName) {
    this.fullNameEmpty = !fullName || fullName.length === 0;
  }

  closeError() {
    this.errorAlert = false;
    this.errorUserAlreadyExist = false;
  }

  showPasswordField() {
    this.showPassword = !this.showPassword;
  }

  deleteAlert() {
    this.deleteUser = !this.deleteUser;
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

  newUser() {
    if (this.currentUser) {
      this.isadmin = this.currentUser.admin;
    } else {
      this.isadmin = false;
    }
    this.selectedUser = { email: '', name: '', phone: '', password: '', admin: false } as User;
    this.showPassword = true;
    // for showing the username input
    this.newUsername = true;
    this.emptyUser = true;
    this.updateUser = false;
    // for showing the delete button
    this.deleteUser = false;
  }

  onSubmitUpdate(id: number, f: NgForm): void {
    this.loading = true;

    if (!f.value.email)
      f.value.email = this.selectedUserEmail;

    if (!f.value.admin)
      f.value.admin = false;

    this.userService.updateUser(id, f.value).subscribe(
      (res: any) => {
        this.router.navigate(['/user-list']);
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
    this.selectedUser = null;
    this.updateUser = false;
  }

  onSubmitDelete(id: number, email: string): void {
    this.loading = true;
    this.userService.deleteUser(id, email).subscribe(
      (res: any) => {
        this.router.navigate(['/user-list']);
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
      }
    );
    this.deleteUser = false;
  }

  onSubmitCreate(f: NgForm): void {
    this.loading = true;
    f.value.location = 'local';
    this.userService.createUser(f.value).subscribe(
      (res: any) => {
        this.loading = false;
        this.router.navigate(['/user-list']);
      }, (err) => {
        this.loading = false;
        this.errorAlert = true;
        if (err.status == 409) {
          this.errorUserAlreadyExist = true;
        }
      }
    );
  }

  getUser(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.loading = false;
      this.newUser();
      return;
    }

    this.userService.getUser(id).subscribe(
      (res: any) => {
        this.selectedUser = res;
        this.loading = false;
      },
      (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false;
      }
    );
  }

  ngOnInit(): void {
    this.getUser();
    if (this.currentUser) {
      this.isadmin = this.currentUser.admin;
    } else {
      this.isadmin = false;
    }
  }
}
