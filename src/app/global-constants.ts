import { HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
export class GlobalConstants {
  
  public static apiURL = environment.apiUrl; 
  public static httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'my-auth-token'
    })
  };
}

