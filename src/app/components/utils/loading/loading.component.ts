import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.less']
})
export class LoadingComponent implements OnChanges {

  constructor() {
    this.loading = true
  }

  @Input() loading: boolean

  ngOnChanges(change) {
    change && change.loading.currentValue != change.loading.previousValue ? this.loading = change.loading.currentValue : null
  }

  
}