import { Component, OnChanges, Input } from '@angular/core';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'hint',
  templateUrl: './hint.component.html',
  styleUrls: ['./hint.component.less']
})

export class HintComponent {

  constructor(
    private apiService: ApiService,
  ) {

  }

  @Input() showHint: boolean
  @Input() hint: string
  
  public loading: boolean = false

  toggleHint() {
    if (this.showHint)
      return this.showHint = false

    if (!this.showHint)
      return this.showHint = true
  }

  ngOnInit(): void { }

}