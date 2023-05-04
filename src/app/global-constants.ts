import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
export class GlobalConstants {

  public static appName = environment.appName
  public static version = environment.version
  public static apiURL = environment.apiUrl
  public static producion = environment.production
  public static radioRemoteUrl = environment.radioRemoteUrl
  public static webSocketUrl = environment.webSocketUrl
  public static hasGPS = environment.hasGPS
  public static domain = environment.domain
  public static gateway = environment.gateway

  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
}

