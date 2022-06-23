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

  ngOnChanges(changes) {
    this.loading = changes.loading.currentValue
  }
}