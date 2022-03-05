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
    { code: 'en', label: 'English' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.siteLocale = window.location.pathname.split('/')[1];
    this.siteLanguage = this.languageList.find(f => f.code === this.siteLocale).label;
  }
}
