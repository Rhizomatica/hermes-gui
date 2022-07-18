import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.less']
})
export class LandingComponent implements OnInit {  

  changeLanguage = false

  constructor(){
  }
  
  changeLanguageModal(){
    this.changeLanguage = this.changeLanguage ? false : true
  }

  setLanguage(language){
    localStorage.setItem('language', language)
    window.open('/'+language, '_self')
  }

  ngOnInit(): void {
  }
}
