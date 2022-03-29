import { HttpHeaders} from '@angular/common/http';
export class GlobalConstants {

  // TODO this must be /api to deploy!
  // public static apiURL = 'http://10.8.0.2/api'; //x k4
  public static apiURL = '/api'; // default to deploy

    public static httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'my-auth-token'
        })
      };
}

