import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
export class GlobalConstants {

  public static appName = environment.appName
  public static version = environment.version
  public static producion = environment.production
  public static local = environment.local
  public static apiURL = environment.local ? 'https://10.8.0.129/api' : `https://${self.location.hostname + '/api'}`
  public static webSocketUrl = environment.local ? 'wss://10.8.0.129:8080/websocket' : `wss://${self.location.hostname + ':8080/websocket'}`
  public static hasGPS = environment.hasGPS
  public static domain = environment.domain
  public static gateway = environment.gateway
  public static bitx = environment.bitx
  public static generalLogin = environment.generalLogin

  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
}

