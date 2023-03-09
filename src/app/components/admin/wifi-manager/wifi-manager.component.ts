import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms';
import { User } from '../../../interfaces/user'
// import { CustomError } from '../../../interfaces/customerror'
// import { UserService } from '../../../_services/user.service'
import { AuthenticationService } from '../../../_services/authentication.service';
import { WifiManagerService } from '../../../_services/wifi-manager.service';

@Component({
  selector: 'wifi-manager',
  templateUrl: './wifi-manager.component.html',
  styleUrls: ['./wifi-manager.component.less']
})

export class WifiManagerComponent implements OnInit {

  currentUser: User
  admin: Boolean
  loading: Boolean = false
  error: String
  errorAlert: Boolean = false
  chanels: Number[] = []
  wiFiSSID: String
  wiFiRetypePassword: any
  wiFiPassword: any
  wiFiChanel: Number = 1
  msgPatternChars: Boolean = false
  excludedKeys: Number[]
  passwordUnmatch = false;
  passwordMin = false

  constructor(
    private authenticationService: AuthenticationService,
    private wifiManagerService: WifiManagerService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  public getWiFiConfig() {
    this.wifiManagerService.getWiFiConfig().subscribe(
      (data: any) => {
        this.wiFiChanel = data.chanel
        this.wiFiSSID = data.ssid
        this.wiFiPassword = data.password
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  public saveWifiConfig(f: NgForm) {

    var formChecked = this.checkForm(f)
    if (!formChecked) {
      this.errorAlert = true;
      return
    }

    this.loading = true
    this.wifiManagerService.changeWiFiName(f.value).subscribe(
      (res: any) => {
        this.wiFiChanel = res.chanel
        this.wiFiSSID = res.ssid
        this.wiFiPassword = res.password
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  _keyUp(event: any) {
    const keyCode = event.keyCode;
    if (this.excludedKeys.includes(keyCode)) {
      event.target.value = event.target.value.replace(event.key, "");
      this.msgPatternChars = true
      return
    }
  }


  checkForm(f) {
    if (!f.value.ssid) {
      f.value.ssid = 'HERMES-DEFAULT'
    }

    if (!f.value.password) {
      return false
    }

    f.value.ssid.array.forEach(item => {

      if (this.excludedKeys.includes(item)) {
        // event.target.value = event.target.value.replace(event.key, "");
        this.msgPatternChars = true
        return false
      }
    });

  }

  public closeError() {
    this.errorAlert = false
  }

  setChanels() {
    for (let index = 1; index < 12; index++) {
      this.chanels.push(index);
    }
  }

  setExcludedKeys() {
    // ?, ", $, [, \, ], +. and space    
    this.excludedKeys = [32, 52, 187, 191, 219, 220, 221, 222]
  }

  checkpass(password, retypePassword) {

    if (password.length < 6) {
      this.passwordMin = true
      return
    }

    this.passwordMin = false

    if (password !== '' && password !== retypePassword) {
      this.passwordUnmatch = true;
      return
    }

    this.passwordUnmatch = false
  }

  ngOnInit(): void {
    this.getWiFiConfig()
    this.setChanels()
    this.setExcludedKeys()
  }
}
