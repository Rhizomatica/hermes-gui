import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../_services/api.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {

  error: any
  system: any
  changeLanguage = false

  constructor(
    private apiService: ApiService

  ) { }

  getSystemStatus(): void{
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res
        return res
      },
      (err) => {
        this.error = err
      }
    );
  }

  scrollToElement($element): void {
    $element.scrollIntoView({behavior: 'smooth', block: 'start', inline: 'nearest'})
  }

  changeLanguageModal(){
    this.changeLanguage = this.changeLanguage ? false : true
  }

  setLanguage(language){
    localStorage.setItem('language', language)
    window.open('/'+language, '_self')
  }

  ngOnInit(): void {
    this.getSystemStatus();
  }

}
