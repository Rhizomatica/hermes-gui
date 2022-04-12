import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
export class GlobalConstants {
  
  public static appName = environment.appName;
  public static apiURL = environment.apiUrl; 
  public static ubitxv6Url = environment.ubitxv6Url; 
  public static producion = environment.production;

  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
}

