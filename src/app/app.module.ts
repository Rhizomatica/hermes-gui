import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './components/app/app.component';
import { homeComponent } from './components/public/home/home.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesComponent } from './components/public/messages/messages.component';
import { MessageDetailComponent } from './components/public/message-detail/message-detail.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HintComponent } from './components/utils/hint/hint.component';
import { LoadingComponent } from './components/utils/loading/loading.component';
import { LogComponent } from './components/admin/log/log.component';
import { StationInformationComponent } from './components/admin/station-information/station-information.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { UserListComponent } from './components/admin/user-list/user-list.component';
import { MessagecomposeComponent } from './components/public/messagecompose/messagecompose.component';
import { LoginComponent } from './components/public/login/login.component';
import { LanguagesComponent } from './components/public/languages/languages.component';
import { CommonModule } from '@angular/common';
import { MessageConfigComponent } from './components/admin/message-config/message-config.component';
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
import localeEs from '@angular/common/locales/es';
import localePt from '@angular/common/locales/pt';
import localeFr from '@angular/common/locales/fr';
import localeEn from '@angular/common/locales/en';
import localeAr from '@angular/common/locales/ar';

import { DarkModeService, DARK_MODE_OPTIONS } from 'angular-dark-mode';
import { ScheduleComponent } from './components/admin/schedule/schedule.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TransmissionListComponent } from './components/admin/transmission-list/transmission-list.component';
import { SwitchComponent } from './components/utils/switch/switch.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PlayerComponent } from './components/utils/player/player.component';
import { RecorderComponent } from './components/utils/recorder/recorder.component';
import { MenuComponent } from './components/public/menu/menu.component';
import { WiFiManagementComponent } from './components/admin/wifi-management/wifi-management.component';
import { VoiceComponent } from './components/public/voice/voice.component';
import { BreadcrumbComponent } from './components/utils/breadcrumb/breadcrumb.component';
import { FloatButtonComponent } from './components/utils/floatbutton/floatbutton.component';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { GPSComponent } from './components/admin/gps/gps.component';
import { SMSComponent } from './components/public/sms/sms.component';
import { SMSChatComponent } from './components/public/smschat/smschat.component';
import { OperatorComponent } from './components/public/operator/operator.component';
import { GlobalConstants } from './global-constants';
import { XYGraphComponent } from './components/utils/xygraph/xygraph.component';
import { ClockHandGraphComponent } from './components/utils/clockhandgraph/clockhandgraph.component';
import { MapGraphComponent } from './components/utils/mapgraph/mapgraph.component';
import { ProgressBarComponent } from './components/utils/progressbar/progressbar.component';
import { RadioConnectionAlertComponent } from './components/utils/radio-connection-alert/radio-connection-alert.component';


registerLocaleData(localeEn);
registerLocaleData(localeFr);
registerLocaleData(localePt);
registerLocaleData(localeEs);
registerLocaleData(localeAr);
@NgModule({
  exports: [
    CommonModule
  ],
  declarations: [
    AppComponent,
    homeComponent,
    MessagesComponent,
    MessageDetailComponent,
    HintComponent,
    LoadingComponent,
    LogComponent,
    StationInformationComponent,
    UserManagementComponent,
    UserListComponent,
    MessagecomposeComponent,
    LoginComponent,
    LanguagesComponent,
    MessageConfigComponent,
    SameUsernameDirective,
    RetypeDirective,
    SentMessagesComponent,
    UserExistDirective,
    EmailComponent,
    RadioConfigComponent,
    FrequencyPipe,
    ScheduleComponent,
    TransmissionListComponent,
    SwitchComponent,
    PlayerComponent,
    RecorderComponent,
    MenuComponent,
    WiFiManagementComponent,
    VoiceComponent,
    BreadcrumbComponent,
    FloatButtonComponent,
    GPSComponent,
    SMSComponent,
    SMSChatComponent,
    OperatorComponent,
    XYGraphComponent,
    ClockHandGraphComponent,
    MapGraphComponent,
    ProgressBarComponent,
    RadioConnectionAlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    AngularFileUploaderModule,
    NgSelectModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: Boolean(GlobalConstants.production), 
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    DecimalPipe,
    { provide: LOCALE_ID, useValue: 'en-US' },
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: LOCALE_ID, useValue: 'ar' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
