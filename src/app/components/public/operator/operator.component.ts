import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { RadioService } from '../../../_services/radio.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.less']
})

export class OperatorComponent implements OnInit {

  currentUser: User = null
  admin: boolean = false
  systemData: object
  loading: boolean = false
  error: Error
  poolSystemData: Subscription

  constructor(
    private authenticationService: AuthenticationService,
    private radioService: RadioService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  getSystemData() {
    // this.loading = true
    // this.radioService.getSystemData().subscribe(
    //   (res: any) => {
    //     if (res)
    //       this.systemData = res

    //     this.loading = false
    //   },
    //   (err) => {
    //     this.error = err;
    //     this.loading = false
    //   }
    // );
  }

  ngOnInit(): void {
    this.getSystemData()

    this.poolSystemData = interval(10000).subscribe((val) => {
      this.getSystemData()
    });
  }
}
