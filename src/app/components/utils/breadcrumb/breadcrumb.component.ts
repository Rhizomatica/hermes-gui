import { Component, OnChanges, Input } from '@angular/core';
import { GlobalConstants } from 'src/app/global-constants';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.less']
})

export class BreadcrumbComponent implements OnChanges {

  constructor() {
    this.currentPage = ''
    this.currentUrl = ''
  }


  @Input() currentPage: string
  @Input() currentUrl: string
  pages = []
  requireLogin: boolean = GlobalConstants.requireLogin
  isArabic: boolean = GlobalConstants.localeId == 'ar' ? true : false

  ngOnInit(): void { }

  ngOnChanges(change) {
    change.currentPage && change.currentPage.currentValue != change.currentPage.previousValue ? this.currentPage = change.currentPage.currentValue : null

    //Nao insere no breadcrumb login nem menu page
    if (this.currentPage == 'login') {
      this.cleanBreadcrumb()
      return
    }

    if (this.currentPage == 'menu') {
      return
    }

    var found = false
    this.pages.forEach((item, index) => {
      if (item.name == this.currentPage) {
        found = true
      }
    })


    //Nao encontrado insere no array
    if (!found) {
      this.addBreadCrumbItem()
      return
    }

    //Se nao remove do array
    this.removeBreadCrumbItem()
  }

  addBreadCrumbItem() {
    //insere novo item no breadcrumb
    const parsedBreadcrumb = JSON.parse('{"name":"' + this.currentPage + '", "url":"' + this.currentUrl + '"}')

    if (this.isArabic)
      this.pages.unshift(parsedBreadcrumb)
    else
      this.pages.push(parsedBreadcrumb)
  }

  removeBreadCrumbItem() {
    if (this.isArabic) {
      // Logic for Arabic (inverted: iterate from start, remove from start with shift())
      for (var i = 0; i < this.pages.length; i++) {
        // Encontrou pagina corrente sai do loop
        if (this.pages[i].name == this.currentPage) {
          return;
        }
        this.pages.shift();
        i--; // Decrement i because the array length changes and elements shift position
      }
    } else {
      // Original logic (Non-Arabic: iterate from end, remove from end with pop())
      for (var i = this.pages.length; i > 0; i--) {
        // Encontrou pagina corrente sai do loop
        if (this.pages[i - 1].name == this.currentPage) {
          return;
        }
        this.pages.pop();
      }
    }
  }

  cleanBreadcrumb() {
    this.pages = []
  }
}