import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { AlertService } from '../alert.service';
// import { Observable, of } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Station } from '../station';
import { GlobalConstants } from '../global-constants';

@Injectable({
  providedIn: 'root'
})
export class StationService {


  constructor(
    private http: HttpClient,
    private alertService: AlertService) { }

    stations: Station[];



    getStations(): Observable<Station[]> {
      const url = `${GlobalConstants.apiURL}/sys/stations`; // get /message/42

      return this.http.get(url).pipe(
        map((res: any) => {
          this.stations = res;
          return this.stations;
      }),
      catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
      console.log(error);
      // return an observable with a user friendly message
      return throwError('Error! something went wrong: ');
    }

    private log(message: string)  {
      this.alertService.add(`Station: ${message}`);
    }


/*  private stationsUrl = 'api/stations';  // URL to web api

    getStations(): Observable<Station[]> {
      return this.http.get<Station[]>(this.stationsUrl)
    }
*/
}
