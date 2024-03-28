import { Component, OnInit } from '@angular/core'
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/_services/api.service';
import { User } from '../../../interfaces/user'
import { AuthenticationService } from '../../../_services/authentication.service';
import { WifiManagerService } from '../../../_services/wifi-manager.service';

@Component({
  selector: 'wifi-manager',
  templateUrl: './wifi-management.component.html',
  styleUrls: ['./wifi-management.component.less']
})

export class WiFiManagementComponent implements OnInit {

  currentUser: User
  admin: boolean
  loading: boolean = false
  error: string
  errorAlert: boolean = false
  errorAlertPatterns: boolean = false
  channels: number[] = []
  wiFiSSID: string
  wiFiRetypePassphrase: string
  wiFiPassphrase: string
  wiFiChannel: number = 1
  msgPatternChars: boolean = false
  excludedKeys: number[]
  passwordUnmatch = false;
  passwordMin = false
  system: any
  macFilter: boolean = false
  macList: string[]
  msgMACListPatternError: boolean = false
  includedKeysMacList: number[]
  newMACAddress: string = ''
  removeMACAddressConfirmation: boolean = false
  macAddressToDelete: string = null

  constructor(
    private apiService: ApiService,
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
        this.wiFiChannel = data.channel
        this.wiFiSSID = data.ssid
        this.wiFiPassphrase = data.wpa_passphrase
        this.macFilter = !data.macaddr_acl || data.macaddr_acl == 0 ? false : true
        this.macList = data.accept_mac_file
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
      this.errorAlertPatterns = true;
      return
    }

    f.value.macaddr_acl = this.macFilter == true ? '1' : '0' //Format

    this.loading = true
    this.wifiManagerService.changeWiFiName(f.value).subscribe(
      (res: any) => {
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

    if (!f.value.wpa_passphrase || f.value.wpa_passphrase !== f.value.wpa_passphrase_retype) {
      return false
    }

    [f.value.ssid].forEach(item => {
      if (this.excludedKeys.includes(item)) {
        return false
      }
    });

    return true
  }

  public closeError() {
    this.errorAlert = false
  }

  setChannels() {
    for (let index = 1; index < 12; index++) {
      this.channels.push(index);
    }
  }

  setExcludedKeys() {
    this.excludedKeys = [32, 52, 187, 191, 219, 220, 221, 222]
  }

  checkpass(password, retypePassword) {

    if (password.length < 8) {
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

  getSystemStatus(): void {
    this.apiService.getStatus().subscribe(
      (res: any) => {
        this.system = res
        this.loading = false
      },
      (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    )
  }

  public toggleMACFilter(f: NgForm) {
    this.macFilter = this.macFilter == true ? false : true //Toggle
    f.value.macFilter = this.macFilter == true ? '1' : '0' //Format

    this.wifiManagerService.toggleMACFilter(f.value).subscribe(
      (res: any) => {
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  public addMACAddress(f: NgForm) {
    this.loading = true
    
    if (!this.validateMACAddress(f.value.macAddress)) {
      this.msgMACListPatternError = true
      this.loading = false
      return
    }

    this.wifiManagerService.updateMACList(f.value).subscribe(
      (res: any) => {
        this.loading = false

        this.getWiFiConfig()

      }, (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  validateMACAddress(macAddress) {
    const macRegex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i

    // Check if the cleaned MAC address matches the regular expression
    return macAddress.match(macRegex)
  }

  public closeMACAddressError() {
    this.msgMACListPatternError = false
  }


  public confirmRemoveMACAddress(address){

    if(!this.removeMACAddressConfirmation){
      this.removeMACAddressConfirmation = true
      this.macAddressToDelete = address
      return
    }

    this.removeMACAddressConfirmation = false
    this.macAddressToDelete = null
  }

  public removeMACAddress(){
    this.removeMACAddressConfirmation = false
    this.loading = true

    this.wifiManagerService.removeMACAddress(this.macAddressToDelete).subscribe(
      (res: any) => {
        this.loading = false
        this.getWiFiConfig()
      }, (err) => {
        this.error = err
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  ngOnInit(): void {
    this.getWiFiConfig()
    this.setChannels()
    this.setExcludedKeys()
    this.getSystemStatus()
  }
}
