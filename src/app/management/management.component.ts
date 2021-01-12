import { Component, OnInit } from '@angular/core';

import { User } from '../user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.less']
})
export class ManagementComponent implements OnInit {
  error = '';
  success = '';
  test = '';
  users: User[];

  constructor(private userService: UserService) { }
  getUsers(): void {
    this.userService.getUsers().subscribe(
      (res: any) => {
        this.users = res;
      },
      (err) => {
        this.error = err;
      }
    );
  }


  ngOnInit(): void {
    this.getUsers();
  }
}