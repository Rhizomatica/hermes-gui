import { HttpHeaders} from '@angular/common/http';
export class GlobalConstants {

    // public static apiURL = 'http://pu2uit.hermes.radio:1011/api';
    public static apiURL = 'http://localhost:8000';
    // TODO this must be fix to localhost in stations!
    // public static apiURL = 'http://localhost/api';

    // TODO get stationname
    public static stationName = 'local';
    public static httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'my-auth-token'
        })
      };
}
