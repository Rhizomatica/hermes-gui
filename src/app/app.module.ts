import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { homeComponent } from './components/public/home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesComponent } from './components/public/messages/messages.component';
import { MessageDetailComponent } from './components/public/message-detail/message-detail.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LogComponent } from './components/admin/log/log.component';
import { StationInformationComponent } from './components/admin/station-information/station-information.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { MessagecomposeComponent } from './components/public/messagecompose/messagecompose.component';
import { LoginComponent } from './components/public/login/login.component';
import { LanguagesComponent } from './components/public/languages/languages.component';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './components/public/help/help.component';
import { MessageadmComponent } from './components/admin/messageadm/messageadm.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SameUsernameDirective } from './directives/same-username.directive';
import { RetypeDirective } from './directives/retype.directive';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { SentMessagesComponent } from './components/public/sent-messages/sent-messages.component';
import { UserExistDirective } from './directives/user-exist.directive';
import { EmailComponent } from './components/public/email/email.component';
import { RadioConfigComponent } from './components/admin/radio-config/radio-config.component';
import { FrequencyPipe } from './frequency.pipe';
import { DecimalPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DarkModeService, DARK_MODE_OPTIONS } from 'angular-dark-mode';
import { GatewayConfigComponent } from './components/admin/gateway-config/gateway-config.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TransmisionListComponent } from './components/admin/transmision-list/transmision-list.component';
import { LoginFormComponent } from './components/public/login-form/login-form.component';
import { RadioScaryComponent } from './components/admin/radio-scary/radio-scary.component';
import { LoadingComponent } from './components/utils/loading/loading.component';
import { SwitchComponent } from './components/utils/switch/switch.component';
import { PlayerComponent } from './components/utils/player/player.component';
import { RecorderComponent } from './components/utils/recorder/recorder.component';
import { MenuComponent } from './components/public/menu/menu.component';
import { WifiManagerComponent } from './components/admin/wifi-manager/wifi-manager.component';
import { VoiceComponent } from './components/public/voice/voice.component';
import { BreadcrumbComponent } from './components/utils/breadcrumb/breadcrumb.component';


registerLocaleData(localePt);

@NgModule({
  exports: [
    CommonModule
  ],
  declarations: [
    AppComponent,
    homeComponent,
    MessagesComponent,
    MessageDetailComponent,
    LogComponent,
    StationInformationComponent,
    UserManagementComponent,
    UpgradeComponent,
    MessagecomposeComponent,
    LoginComponent,
    LanguagesComponent,
    HelpComponent,
    MessageadmComponent,
    SameUsernameDirective,
    RetypeDirective,
    SentMessagesComponent,
    UserExistDirective,
    EmailComponent,
    RadioConfigComponent,
    FrequencyPipe,
    GatewayConfigComponent,
    TransmisionListComponent,
    LoginFormComponent,
    RadioScaryComponent,
    LoadingComponent,
    SwitchComponent,
    PlayerComponent,
    RecorderComponent,
    MenuComponent,
    WifiManagerComponent,
    VoiceComponent,
    BreadcrumbComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    AngularFileUploaderModule,
    NgSelectModule
  ],
  providers: [
    DecimalPipe,
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
