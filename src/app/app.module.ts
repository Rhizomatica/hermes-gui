import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';

import { HomeComponent } from './components/public/home/home.component';
import { MessagesComponent } from './components/public/messages/messages.component';
import { MessageDetailComponent } from './components/public/message-detail/message-detail.component';
import { MessagecomposeComponent } from './components/public/messagecompose/messagecompose.component';
import { SentMessagesComponent } from './components/public/sent-messages/sent-messages.component';
import { LoginComponent } from './components/public/login/login.component';
import { LanguagesComponent } from './components/public/languages/languages.component';
import { EmailComponent } from './components/public/email/email.component';
import { MenuComponent } from './components/public/menu/menu.component';
import { VoiceComponent } from './components/public/voice/voice.component';
import { SMSComponent } from './components/public/sms/sms.component';
import { SMSChatComponent } from './components/public/smschat/smschat.component';
import { OperatorComponent } from './components/public/operator/operator.component';

import { LogComponent } from './components/admin/log/log.component';
import { StationInformationComponent } from './components/admin/station-information/station-information.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { MessageConfigComponent } from './components/admin/message-config/message-config.component';
import { RadioConfigComponent } from './components/admin/radio-config/radio-config.component';
import { ScheduleComponent } from './components/admin/schedule/schedule.component';
import { TransmissionListComponent } from './components/admin/transmission-list/transmission-list.component';
import { WiFiManagementComponent } from './components/admin/wifi-management/wifi-management.component';
import { GPSComponent } from './components/admin/gps/gps.component';

import { HintComponent } from './components/utils/hint/hint.component';
import { LoadingComponent } from './components/utils/loading/loading.component';
import { SwitchComponent } from './components/utils/switch/switch.component';
import { PlayerComponent } from './components/utils/player/player.component';
import { RecorderComponent } from './components/utils/recorder/recorder.component';
import { BreadcrumbComponent } from './components/utils/breadcrumb/breadcrumb.component';
import { FloatButtonComponent } from './components/utils/floatbutton/floatbutton.component';
import { XYGraphComponent } from './components/utils/xygraph/xygraph.component';
import { ClockHandGraphComponent } from './components/utils/clockhandgraph/clockhandgraph.component';
import { MapGraphComponent } from './components/utils/mapgraph/mapgraph.component';
import { ProgressBarComponent } from './components/utils/progressbar/progressbar.component';

import { SameUsernameDirective } from './directives/same-username.directive';
import { RetypeDirective } from './directives/retype.directive';
import { UserExistDirective } from './directives/user-exist.directive';

import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';

import { NgSelectModule } from '@ng-select/ng-select';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { ServiceWorkerModule } from '@angular/service-worker';

import localeEn from '@angular/common/locales/en';
import localeFr from '@angular/common/locales/fr';
import localePt from '@angular/common/locales/pt';
import localeEs from '@angular/common/locales/es';
import localeAr from '@angular/common/locales/ar';

import { environment } from '../environments/environment';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FilterPipe } from './pipes/filter.pipe';

registerLocaleData(localeEn);
registerLocaleData(localeFr);
registerLocaleData(localePt);
registerLocaleData(localeEs);
registerLocaleData(localeAr);

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MessagesComponent,
    MessageDetailComponent,
    MessagecomposeComponent,
    SentMessagesComponent,
    LoginComponent,
    LanguagesComponent,
    EmailComponent,
    MenuComponent,
    VoiceComponent,
    SMSComponent,
    SMSChatComponent,
    OperatorComponent,

    LogComponent,
    StationInformationComponent,
    UserManagementComponent,
    MessageConfigComponent,
    RadioConfigComponent,
    ScheduleComponent,
    TransmissionListComponent,
    WiFiManagementComponent,
    GPSComponent,

    HintComponent,
    LoadingComponent,
    SwitchComponent,
    PlayerComponent,
    RecorderComponent,
    BreadcrumbComponent,
    FloatButtonComponent,
    XYGraphComponent,
    ClockHandGraphComponent,
    MapGraphComponent,
    ProgressBarComponent,

    SameUsernameDirective,
    RetypeDirective,
    UserExistDirective,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgSelectModule,
    NgIdleKeepaliveModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    AppRoutingModule
  ],
  providers: [
    DecimalPipe,
    { provide: LOCALE_ID, useValue: 'en-US' }, { provide: LOCALE_ID, useValue: 'pt' },
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: LOCALE_ID, useValue: 'fr' },
    { provide: LOCALE_ID, useValue: 'ar' },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA]

})
export class AppModule { }
