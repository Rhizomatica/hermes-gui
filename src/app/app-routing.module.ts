import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../app/_helpers/auth.guard';
import { homeComponent } from './components/public/home/home.component';
import { MessagesComponent } from './components/public/messages/messages.component';
import { MessageDetailComponent } from './components/public/message-detail/message-detail.component';
import { LogComponent } from './components/admin/log/log.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { MessagecomposeComponent } from './components/public/messagecompose/messagecompose.component';
import { StationInformationComponent } from './components/admin/station-information/station-information.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { LoginComponent } from './components/public/login/login.component';
import { LanguagesComponent } from './components/public/languages/languages.component';
import { MessageConfigComponent } from './components/admin/message-config/message-config.component';
import { SentMessagesComponent } from './components/public/sent-messages/sent-messages.component';
import { EmailComponent } from './components/public/email/email.component';
import { HelpComponent } from './components/public/help/help.component';
import { RadioConfigComponent } from './components/admin/radio-config/radio-config.component';
import { ScheduleComponent } from './components/admin/schedule/schedule.component';
import { TransmisionListComponent } from './components/admin/transmision-list/transmision-list.component';
import { SwitchComponent } from './components/utils/switch/switch.component';
import { RadioScaryComponent } from './components/admin/radio-scary/radio-scary.component';
import { LoadingComponent } from './components/utils/loading/loading.component';
import { PlayerComponent } from './components/utils/player/player.component';
import { RecorderComponent } from './components/utils/recorder/recorder.component';
import { MenuComponent } from './components/public/menu/menu.component';
import { WiFiConfigurationComponent } from './components/admin/wifi-config/wifi-config.component';
import { VoiceComponent } from './components/public/voice/voice.component';
import { BreadcrumbComponent } from './components/utils/breadcrumb/breadcrumb.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: homeComponent },
  { path: 'messages', component: MessagesComponent },
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
  { path: 'message-config', component: MessageConfigComponent },
  { path: 'sent', component: SentMessagesComponent },
  { path: 'email', component: EmailComponent },
  { path: 'help', component: HelpComponent },
  { path: 'radio-config', component: RadioConfigComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'transmision', component: TransmisionListComponent },
  { path: 'switch', component: SwitchComponent },
  { path: 'scary', component: RadioScaryComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'recorder', component: RecorderComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'wifi-config', component: WiFiConfigurationComponent },
  { path: 'voice', component: VoiceComponent },
  { path: 'breadcrumb', component: BreadcrumbComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
