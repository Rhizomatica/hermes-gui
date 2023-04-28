import { Component, OnInit } from '@angular/core'
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';

@Component({
  selector: 'radiophony',
  templateUrl: './radiophony.component.html',
  styleUrls: ['./radiophony.component.less']
})

export class RadiophonyComponent implements OnInit {

  currentUser: User
  admin: Boolean
  loading: Boolean = false
  error: String
  errorAlert: Boolean = false
  frequency: number = 7140
  
  constructor(
    private authenticationService: AuthenticationService,
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  public closeError() {
    this.errorAlert = false;
  }
  
  ngOnInit(): void {
    
  }
}
