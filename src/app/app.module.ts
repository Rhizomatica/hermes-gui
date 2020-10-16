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
import { LogComponent } from './log/log.component';
import { MailadminComponent } from './mailadmin/mailadmin.component';
import { NetadminComponent } from './netadmin/netadmin.component';
import { ManagementComponent } from './management/management.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { MessagecomposeComponent } from './messagecompose/messagecompose.component';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    StationsComponent,
    HmheaderComponent,
    MessagesComponent,
    MessageDetailComponent,
    AlertsComponent,
    SysadminComponent,
    LogComponent,
    MailadminComponent,
    NetadminComponent,
    ManagementComponent,
    UpgradeComponent,
    MessagecomposeComponent,
    LoginComponent
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
