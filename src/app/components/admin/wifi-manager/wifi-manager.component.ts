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

//USAR ALGUMA OUTRA FIRMWARE OPENSOURCE
// https://randomnerdtutorials.com/esp32-wi-fi-manager-asyncwebserver/
// https://dronebotworkshop.com/wifimanager/
// https://github.com/rampageX/firmware-mod-kit
// https://forum.dd-wrt.com/wiki/index.php/Development

// https://www.polarcloud.com/tomato
// https://www.gargoyle-router.com/
// https://openwrt.org/
// https://dd-wrt.com/

// // https://linuxhint.com/3-ways-to-connect-to-wifi-from-the-command-line-on-debian/

// Abrir NMTUI na HERMES GUI
// https://docs.rockylinux.org/gemstones/nmtui/
// https://docs.rockylinux.org/gemstones/nmtui/
// https://github.com/qwefgh90/ng-terminal/wiki

// USE NMCLI COMANDS
// https://docs.rockylinux.org/gemstones/nmtui/
// https://www.thegeekdiary.com/how-to-set-a-custom-interface-name-with-networkmanager-in-centos-rhel-7/

//BALANCO
//--------------------------------------------------------------------------------------------------------------

//HOTSPOT FIRMWARE
//PROS
//  Diferentes opcoes de firmware customizaveis 
//  Controle total como página de gerenciamento de RED (aparentemente opcao mais completa...)  
//CONTRAS
//  Curva de aprendizagem
//  Fora da aplicacao mesmo mantendo interface similar
//  Necessidade de hospot *confirmar

//NMCLI
//PROS
//  Padronizacao da interface
//  somente configuracoes desejadas (customizado)
//CONTRAS
//  curva de aprendizado (CLI)
//  Implementar cada funcionalidade
//  

// NMTUI
//PROS
//  Pronto para uso
//  várias configuracoes
//CONTRAS
//  Implementar terminal (TESTAR OUTPUT DA INTERFACE)
//  Possibilidade de nao funcionar
//  Visao de terminal (depende do tipo de usuário)

export class WifiManagerComponent implements OnInit {

  currentUser: User
  admin: Boolean
  loading: Boolean = false
  error: String
  errorAlert: Boolean = false
  wifiName: any //TODO - Review Type
  wifiList: []

  constructor(
    private authenticationService: AuthenticationService,
    private wifiManagerService: WifiManagerService
  ) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    if (this.currentUser)
      this.admin = this.currentUser.admin
  }

  public getWifiList() {
    this.wifiManagerService.getWiFiList().subscribe(
      (data: any) => {
        this.wifiList = data
        this.wifiName = data.filter((a) => { return a[0] === 'yes'})[0] //TODO - review return
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true
        this.loading = false
      }
    );
  }

  public saveWifiConfig(f: NgForm) {

    if (!f.value.name) {
      f.value.name = 'HERMES-DEFAULT'
    }

    this.loading = true
    this.wifiManagerService.changeWifiName(f.value).subscribe(
      (res: any) => {
        this.wifiName = res
        this.loading = false
      }, (err) => {
        this.error = err;
        this.errorAlert = true;
        this.loading = false
      }
    );
  }

  public closeError() {
    this.errorAlert = false
  }

  ngOnInit(): void {
    this.getWifiList()
  }
}
