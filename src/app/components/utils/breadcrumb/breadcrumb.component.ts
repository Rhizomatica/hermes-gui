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
  generalLogin: boolean = GlobalConstants.generalLogin

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
    this.pages.push(JSON.parse('{"name":"' + this.currentPage + '", "url":"' + this.currentUrl + '"}'))
  }

  removeBreadCrumbItem() {
    //Se ja foi encontrado remove ao renavegar pelo breadcrumb
    for (var i = this.pages.length; i >= 0; i--) {
      //Encontrou pagina corrente sai do loop
      if (this.pages[i - 1].name == this.currentPage) {
        return
      }
      this.pages.pop()
    }
  }

  cleanBreadcrumb() {
    this.pages = []
  }
}