import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-languages',
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.less'],
})

export class LanguagesComponent implements OnInit {

  siteLanguage = 'English';
  siteLocale: string;
  languageList = [
    { code: 'pt', label: 'Português' },
    { code: 'es', label: 'Español' },
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'Français' }
    // { code: 'sag', label: 'Sango' }
  ];

  constructor() { }

  setLanguage(language) {
    localStorage.setItem('language', language)
    window.open('/' + language, '_self')
  }

  ngOnInit(): void {
    this.siteLocale = window.location.pathname.split('/')[1];
    var currentUrlLanguage = this.languageList.find(f => f.code === this.siteLocale);

    if(currentUrlLanguage){
      this.siteLanguage = currentUrlLanguage.label
    }
  }
}
