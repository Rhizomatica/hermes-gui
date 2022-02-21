import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.less']
})
export class EmailComponent implements OnInit {

  linksOn = false;


  constructor() { }

  showlinks() {
  if (this.linksOn == true) {
    this.linksOn = false
  } else {
    this.linksOn = true;
  }



}

  ngOnInit(): void {
  }

}
