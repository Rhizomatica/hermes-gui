import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD
import { MessagesComponent } from "./messages/messages.component";
import { SysadminComponent } from './sysadmin/sysadmin.component'; 
import { StationsComponent } from './stations/stations.component'; 

=======
import { MessagesComponent } from './messages/messages.component';
>>>>>>> 7f4bcdfc3717d8ada75c012b250ea7c1a7f90f0a

const routes: Routes = [
  { path: 'messages', component: MessagesComponent},
  { path: 'admin', component: SysadminComponent},
  { path: 'stations', component: StationsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
