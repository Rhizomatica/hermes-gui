import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user';
import { UserService } from '../../../_services/user.service';
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.less']
})

export class UserListComponent implements OnInit {

  currentUser: User;
  searchUser: string;
  error: Error;
  users: User[];
  errorAlert = false;
  loading = false;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;
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
    this.getUsers();
  }
}