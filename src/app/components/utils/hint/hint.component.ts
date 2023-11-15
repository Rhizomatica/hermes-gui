import { Component, OnChanges, Input } from '@angular/core';
import { AuthenticationService } from 'src/app/_services/authentication.service';
import { User } from 'src/app/interfaces/user';

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
  }

  @Input() showHint: boolean
  @Input() hint: string
  
  public loading: boolean = false
  public language: string = null
  public currentUser: User;

  toggleHint() {
    if (this.showHint)
      return this.showHint = false

    if (!this.showHint)
      return this.showHint = true
  }

  ngOnInit(): void { 
    this.language = localStorage.getItem('language')
  }

}