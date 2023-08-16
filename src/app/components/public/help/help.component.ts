import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_services/api.service';
import { GlobalConstants } from '../../../global-constants';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {

  error: any
  domain: string = GlobalConstants.domain
  version: string = GlobalConstants.version
  changeLanguage = false

  constructor(
    private apiService: ApiService

  ) { }


  scrollToElement($element): void {
    $element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
  }

  changeLanguageModal() {
    this.changeLanguage = this.changeLanguage ? false : true
  }

  setLanguage(language){
    localStorage.setItem('language', language)
    window.open('/'+language, '_self')
  }
  
  ngOnInit(): void {
  }
}
