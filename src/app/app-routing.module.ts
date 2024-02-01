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
import { RadioConfigComponent } from './components/admin/radio-config/radio-config.component';
import { ScheduleComponent } from './components/admin/schedule/schedule.component';
import { TransmissionListComponent } from './components/admin/transmission-list/transmission-list.component';
import { SwitchComponent } from './components/utils/switch/switch.component';
import { LoadingComponent } from './components/utils/loading/loading.component';
import { PlayerComponent } from './components/utils/player/player.component';
import { RecorderComponent } from './components/utils/recorder/recorder.component';
import { MenuComponent } from './components/public/menu/menu.component';
import { WiFiManagementComponent } from './components/admin/wifi-management/wifi-management.component';
import { VoiceComponent } from './components/public/voice/voice.component';
import { BreadcrumbComponent } from './components/utils/breadcrumb/breadcrumb.component';
import { FloatButtonComponent } from './components/utils/floatbutton/floatbutton.component';
import { HintComponent } from './components/utils/hint/hint.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: homeComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'message/:id', component: MessageDetailComponent },
  { path: 'log', component: LogComponent },
  { path: 'user-manage', component: UserManagementComponent },
  { path: 'user-manage/:id', component: UserManagementComponent },
  { path: 'compose', component: MessagecomposeComponent },
  { path: 'response/:origin', component: MessagecomposeComponent },
  { path: 'station-info', component: StationInformationComponent },
  { path: 'upgrade', component: UpgradeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'languages', component: LanguagesComponent },
  { path: 'message-config', component: MessageConfigComponent },
  { path: 'sent', component: SentMessagesComponent },
  { path: 'email', component: EmailComponent },
  { path: 'radio-config', component: RadioConfigComponent },
  { path: 'schedule', component: ScheduleComponent },
  { path: 'transmission', component: TransmissionListComponent },
  { path: 'switch', component: SwitchComponent },
  { path: 'loading', component: LoadingComponent },
  { path: 'player', component: PlayerComponent },
  { path: 'recorder', component: RecorderComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'wifi-manage', component: WiFiManagementComponent },
  { path: 'voice', component: VoiceComponent },
  { path: 'breadcrumb', component: BreadcrumbComponent },
  { path: 'floatbutton', component: FloatButtonComponent },
  { path: 'hint', component: HintComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }
