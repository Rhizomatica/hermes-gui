import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/_helpers/auth.guard';
import { LandingComponent } from './components/public/landing/landing.component';
import { MessagesComponent } from './components/public/messages/messages.component';
import { SysadminComponent } from './components/admin/sysadmin/sysadmin.component';
// import { StationsComponent } from './components/admin/stations/stations.component';
import { MessageDetailComponent } from './components/public/message-detail/message-detail.component';
import { LogComponent } from './components/admin/log/log.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { MessagecomposeComponent } from './components/public/messagecompose/messagecompose.component';
import { StationInformationComponent } from './components/admin/station-information/station-information.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { LoginComponent } from './components/public/login/login.component';
import { LanguagesComponent } from './components/public/languages/languages.component';
import { MessageadmComponent } from './components/admin/messageadm/messageadm.component';
import { SentMessagesComponent } from './components/public/sent-messages/sent-messages.component';
import { EmailComponent } from './components/public/email/email.component';
import { HelpComponent } from './components/public/help/help.component';
import { RadioConfigComponent } from './components/admin/radio-config/radio-config.component';
import { RadioComponent } from './components/admin/radio/radio.component';
import { GatewayConfigComponent } from './components/admin/gateway-config/gateway-config.component';
import { TransmisionListComponent } from './components/admin/transmision-list/transmision-list.component';
import { SwitchComponent } from './components/utils/switch/switch.component';
import { RadioScaryComponent } from './components/admin/radio-scary/radio-scary.component';
import { LoadingComponent } from './components/utils/loading/loading.component';
import { PlayerComponent } from './components/utils/player/player.component';
import { RecorderComponent } from './components/utils/recorder/recorder.component';
import { MenuComponent } from './components/public/menu/menu.component';
import { WifiManagerComponent } from './components/admin/wifi-manager/wifi-manager.component';
import { RadiophonyComponent } from './components/public/radiophony/radiophony.component';

const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: LandingComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'admin', component: SysadminComponent },
  // { path: 'stations', component: StationsComponent },
  { path: 'message/:id', component: MessageDetailComponent },
  { path: 'log', component: LogComponent },
  { path: 'usermanage', component: UserManagementComponent },
  { path: 'usermanage/:id', component: UserManagementComponent },
  { path: 'compose', component: MessagecomposeComponent },
  { path: 'response/:origin', component: MessagecomposeComponent },
  { path: 'stationinformation', component: StationInformationComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'languages', component: LanguagesComponent },
  { path: 'messageadm', component: MessageadmComponent },
  { path: 'sent', component: SentMessagesComponent },
  { path: 'email', component: EmailComponent },
  { path: 'help', component: HelpComponent },
  { path: 'radioconfig', component: RadioConfigComponent },
  { path: 'radio', component: RadioComponent },
  { path: 'gateway', component: GatewayConfigComponent },
  { path: 'transmision', component: TransmisionListComponent },
  { path: 'switch', component: SwitchComponent },
  { path: 'scary', component: RadioScaryComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'recorder', component: RecorderComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'wifiManager', component: WifiManagerComponent },
  { path: 'radiophony', component:   RadiophonyComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
