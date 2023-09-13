import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
export class GlobalConstants {

  public static local = environment.local
  public static producion = environment.production
  public static serverIP = '10.8.0.128'
  public static apiURL = environment.local ? `https://${environment.serverIP}/api` : `https://${self.location.hostname}/api`
  public static webSocketUrl = environment.local ? `wss://${environment.serverIP}/websocket` : `wss://${self.location.hostname + ':8080/websocket'}`
  public static domain = environment.domain
  public static gateway = environment.gateway
  public static bitx = environment.bitx
  public static hasGPS = environment.hasGPS
  public static generalLogin = environment.generalLogin
  public static emergencyEmail = environment.emergencyEmail

  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
}

