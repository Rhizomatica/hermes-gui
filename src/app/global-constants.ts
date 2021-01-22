import { HttpHeaders} from '@angular/common/http';
export class GlobalConstants {

    public static apiURL: string = "http://pu2uit.hermes.radio:1011/api";
    //public static apiURL: string = "http://localhost:8000/";
    //TODO this must be fix to localhost in stations!
    //public static apiURL: string = "http://localhost/api";

    public  httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
          Authorization: 'my-auth-token'
        })
      };

    public static teste: boolean = false;
}