import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
export class GlobalConstants {


  public static local = environment.local
  public static serverIP = '10.70.96.5'
  public static production = environment.production
  public static apiURL = this.local ? `https://${this.serverIP}/api` : `https://${self.location.hostname}/api`
  public static webSocketUrl = this.local ? `wss://${this.serverIP}:8080/websocket` : `wss://${self.location.hostname + ':8080/websocket'}`
  public static domain = environment.domain
  public static gateway = environment.gateway
  public static bitx = environment.bitx
  public static hasGPS = environment.hasGPS
  public static gpsMap = environment.gpsMap
  public static requireLogin = environment.requireLogin
  public static emergencyEmail = environment.emergencyEmail
  public static localeId = environment.localeId

  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
}

