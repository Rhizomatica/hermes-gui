import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { LandingComponent } from './components/public/landing/landing.component';
import { StationsComponent } from './components/admin/stations/stations.component';
// import { HmheaderComponent } from './components/hmheader/hmheader.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MessagesComponent } from './components/public/messages/messages.component';
import { MessageDetailComponent } from './components/public/message-detail/message-detail.component';
import { SysadminComponent } from './components/admin/sysadmin/sysadmin.component';
import { AngularFileUploaderModule } from 'angular-file-uploader';
// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LogComponent } from './components/admin/log/log.component';
import { NetadminComponent } from './components/admin/netadmin/netadmin.component';
import { ManagementComponent } from './components/admin/management/management.component';
import { UpgradeComponent } from './components/upgrade/upgrade.component';
import { MessagecomposeComponent } from './components/public/messagecompose/messagecompose.component';
import { LoginComponent } from './components/public/login/login.component';
import { LanguagesComponent } from './components/public/languages/languages.component';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './components/public/help/help.component';
import { MessageadmComponent } from './components/admin/messageadm/messageadm.component';
import { ForgotpasswordComponent } from './components/public/forgotpassword/forgotpassword.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { SameUsernameDirective } from './directives/same-username.directive';
import { RetypeDirective } from './directives/retype.directive';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor} from './_helpers/error.interceptor';
import { SentMessagesComponent } from './components/public/sent-messages/sent-messages.component';
import { UserExistDirective } from './directives/user-exist.directive';
import { EmailComponent } from './components/public/email/email.component';
import { RadioConfigComponent } from './components/admin/radio-config/radio-config.component';
import { FrequencyPipe } from './frequency.pipe';
import {DecimalPipe} from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { TestradioComponent } from './components/admin/testradio/testradio.component';
import {DarkModeService, DARK_MODE_OPTIONS} from 'angular-dark-mode';
import { GatewayConfigComponent } from './components/admin/gateway-config/gateway-config.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { TransmissionListComponent } from './components/admin/transmission-list/transmission-list.component';
import { HomeComponent } from './home/home.component';
import { LoginFormComponent } from './components/login-form/login-form.component';


registerLocaleData(localePt);

// import { CLIENT_RENEG_LIMIT } from 'tls';

/*export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, '.assets/i18n/', '.json');
}*/

@NgModule({
  exports: [
    CommonModule,
  //  TranslateModule
  ],
  declarations: [
    AppComponent,
    LandingComponent,
    StationsComponent,
    // HmheaderComponent,
    MessagesComponent,
    MessageDetailComponent,
    SysadminComponent,
    LogComponent,
    NetadminComponent,
    ManagementComponent,
    UpgradeComponent,
    MessagecomposeComponent,
    LoginComponent,
    LanguagesComponent,
    HelpComponent,
    MessageadmComponent,
    ForgotpasswordComponent,
    SameUsernameDirective,
    RetypeDirective,
    SentMessagesComponent,
    UserExistDirective,
    EmailComponent,
    RadioConfigComponent,
    FrequencyPipe,
    TestradioComponent,
    GatewayConfigComponent,
    TransmissionListComponent,
    HomeComponent,
    LoginFormComponent
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
