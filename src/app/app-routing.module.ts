import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './components/public/landing/landing.component';
import { MessagesComponent } from './components/public/messages/messages.component';
import { SysadminComponent } from './components/admin/sysadmin/sysadmin.component';
import { StationsComponent } from './components/admin/stations/stations.component';
import { MessageDetailComponent } from './components/public/message-detail/message-detail.component';
import { LogComponent } from './components/admin/log/log.component';
import { ManagementComponent } from './components/admin/management/management.component';
import { MessagecomposeComponent } from './components/public/messagecompose/messagecompose.component';
import { NetadminComponent } from './components/admin/netadmin/netadmin.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { LoginComponent } from './components/public/login/login.component';
import { LanguagesComponent } from './components/public/languages/languages.component';
import { MessageadmComponent } from './components/admin/messageadm/messageadm.component';
import { ForgotpasswordComponent } from './components/public/forgotpassword/forgotpassword.component';
import { SentMessagesComponent } from './components/sent-messages/sent-messages.component';
import { EmailComponent } from './components/public/email/email.component';
import {HelpComponent} from './components/public/help/help.component';
import { RadioConfigComponent } from './components/admin/radio-config/radio-config.component';
import { TestradioComponent } from './components/testradio/testradio.component';
import { GatewayConfigComponent } from './components/gateway-config/gateway-config.component';
import { TransmissionListComponent } from './components/admin/transmission-list/transmission-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent},
  { path: 'messages', component: MessagesComponent},
  { path: 'admin', component: SysadminComponent},
  { path: 'stations', component: StationsComponent},
  { path: 'message/:id', component: MessageDetailComponent},
  { path: 'log', component: LogComponent},
  { path: 'manage', component: ManagementComponent},
  { path: 'manage/:id', component: ManagementComponent},
  { path: 'compose', component: MessagecomposeComponent},
  { path: 'netadmin', component: NetadminComponent},
  { path: 'upgrade', component: UpgradeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'languages', component: LanguagesComponent},
  { path: 'messageadm', component: MessageadmComponent},
  { path: 'recovery', component: ForgotpasswordComponent},
  { path: 'sent', component: SentMessagesComponent},
  { path: 'email', component: EmailComponent},
  { path: 'help', component: HelpComponent},
  { path: 'radioconfig', component: RadioConfigComponent},
  { path: 'testradio', component: TestradioComponent},
  { path: 'gateway', component: GatewayConfigComponent},
  { path: 'transmission', component: TransmissionListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
