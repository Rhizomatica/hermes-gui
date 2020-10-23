import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MessagesComponent } from './messages/messages.component';
import { SysadminComponent } from './sysadmin/sysadmin.component';
import { StationsComponent } from './stations/stations.component';
import { MessageDetailComponent } from './message-detail/message-detail.component';
import { LogComponent } from './log/log.component';
import { MailadminComponent } from './mailadmin/mailadmin.component';
import { ManagementComponent } from './management/management.component';
import { MessagecomposeComponent } from './messagecompose/messagecompose.component';
import { NetadminComponent } from './netadmin/netadmin.component';
import { UpgradeComponent } from './upgrade/upgrade.component';
import { LoginComponent } from './login/login.component';
import { LanguagesComponent } from './languages/languages.component';

const routes: Routes = [
  { path: '', redirectTo: '/messages', pathMatch: 'full' },
  { path: 'messages', component: MessagesComponent},
  { path: 'admin', component: SysadminComponent},
  { path: 'stations', component: StationsComponent},
  { path: 'message/:id', component: MessageDetailComponent},
  { path: 'log', component: LogComponent},
  { path: 'mailadmin', component: MailadminComponent},
  { path: 'manage', component: ManagementComponent},
  { path: 'compose', component: MessagecomposeComponent},
  { path: 'netadmin', component: NetadminComponent},
  { path: 'upgrade', component: UpgradeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'languages', component: LanguagesComponent}






];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
