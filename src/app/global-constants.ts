import { HttpHeaders} from '@angular/common/http';
export class GlobalConstants {

   //public static apiURL = 'http://pu2uit.hermes.radio:1011/api';
   //public static apiURL = 'https://pu4gnu.hermes.radio:4443/api';
   //public static apiURL = 'http://localhost:8000';
   // TODO this must be fix to localhost in stations!
   //public static apiURL = 'http://201.80.171.109:8000/api';
   //public static apiURL = 'https://10.8.0.3/api';
   //public static apiURL = 'http://192.168.0.4/api';
   public static apiURL = '/api';

   // TODO get stationname
    public static stationName = 'local';
    public static httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'my-auth-token'
        })
      };
}
