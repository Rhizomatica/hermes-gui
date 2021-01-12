import { Component, OnInit } from '@angular/core';

import { User } from '../users';
import { UserService } from '../user.service';
import { Station } from '../station';
import { StationService } from '../station.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
