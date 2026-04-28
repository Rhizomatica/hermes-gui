import { Component, OnChanges, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';
import { GlobalConstants } from 'src/app/global-constants';

@Component({
  selector: 'hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.less']
})

export class HintComponent {

  constructor(
    private authenticationService: AuthenticationService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.showHint = false
    this.hint = ''
  }

  @Input() showHint: boolean
  @Input() hint: string

  public loading: boolean = false
  public language: string = 'en-US'
  public currentUser!: User;
  public bitx: string = GlobalConstants.bitx

  toggleHint() {
    if (this.showHint)
      return this.showHint = false

    if (!this.showHint)
      return this.showHint = true
  }

  ngOnInit(): void {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      this.language = storedLanguage;
    }
  }

}