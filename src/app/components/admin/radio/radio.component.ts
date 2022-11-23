import { Component, OnInit } from '@angular/core'
import { DecimalPipe } from '@angular/common'
import { AuthenticationService } from '../../../_services/authentication.service'
import { User } from '../../../interfaces/user'
import { GlobalConstants } from '../../../global-constants'
import { DomSanitizer } from '@angular/platform-browser'

@Component({
  selector: 'app-radio',
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.less'],
  providers: [DecimalPipe],
})

export class RadioComponent implements OnInit {
  public radio: any = []
  error: Error;
  errorAlert: false
  currentUser: User
  isAdmin = false
  radioRemoteUrl: any
  
  constructor(
    private authenticationService: AuthenticationService,
    private sanitizer: DomSanitizer) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x)
    if(this.currentUser)
      this.isAdmin = this.currentUser.admin
  }

  closeError() {
    this.errorAlert = false
  }

  ngOnInit(): void {
    this.radioRemoteUrl = this.sanitizer.bypassSecurityTrustResourceUrl(GlobalConstants.radioRemoteUrl)
  }
}

