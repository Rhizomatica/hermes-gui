import { HttpHeaders} from '@angular/common/http';
export class GlobalConstants {

  // TODO this must be /api to deploy!
  //public static apiURL = 'https://10.8.0.2/api'; // k4
  //public static apiURL = 'https://10.8.0.3/api'; // k6
  //public static apiURL = 'http://192.168.0.4/api';
  public static apiURL = 'http://192.168.0.105/api';
  //public static apiURL = '/api'; //default to deploy

    public static httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'my-auth-token'
        })
      };
}
