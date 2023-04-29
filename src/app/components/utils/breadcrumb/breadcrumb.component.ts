import { Component, OnChanges, Input } from '@angular/core';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.less']
})

export class BreadcrumbComponent implements OnChanges {

  constructor() {
    this.pages = []
  }


  @Input() pages: []

  ngOnInit(): void {
  }

  ngOnChanges(change) {
    change.pages && change.pages.currentValue != change.pages.previousValue ? this.pages = change.pages.currentValue: null
  }
}
