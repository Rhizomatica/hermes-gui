import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { SysadminComponent } from './sysadmin/sysadmin.component';
import { StationsComponent } from './stations/stations.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/messages', pathMatch: 'full' },
  { path: 'messages', component: MessagesComponent},
  { path: 'admin', component: SysadminComponent},
  { path: 'stations', component: StationsComponent},
  { path: 'message/:id', component: MessageDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
