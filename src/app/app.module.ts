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
<<<<<<< HEAD
import { SysadminComponent } from './sysadmin/sysadmin.component'; 

=======
>>>>>>> 7f4bcdfc3717d8ada75c012b250ea7c1a7f90f0a

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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
