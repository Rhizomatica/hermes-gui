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
    changes.changes && changes.changes.loading.currentValue != changes.loading.previousValue ? this.loading = changes.loading.currentValue : null
  }
}