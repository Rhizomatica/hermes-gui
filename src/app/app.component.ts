import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'hermes.radio';

  isadmin = true;

  loggedin() {
    if(this.isadmin) {
      this.isadmin = false;
      console.log(this.isadmin);
    } else {
      this.isadmin = true;
      console.log(this.isadmin);
    }
  }


}
