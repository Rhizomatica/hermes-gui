import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StationsComponent } from './stations/stations.component';
import { HmheaderComponent } from './hmheader/hmheader.component';
import { FormsModule } from '@angular/forms';
import { MessagesComponent } from './messages/messages.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { AlertsComponent } from './alerts/alerts.component';
import { SysadminComponent } from './sysadmin/sysadmin.component';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    StationsComponent,
    HmheaderComponent,
    MessagesComponent,
    MessageDetailComponent,
    AlertsComponent,
    SysadminComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

// It's a TRAP!
// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
// and returns simulated server responses.
// Remove it when a real server is ready to receive requests.
// HttpClientInMemoryWebApiModule.forRoot(
//  InMemoryDataService, { dataEncapsulation: false }
// )

  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
