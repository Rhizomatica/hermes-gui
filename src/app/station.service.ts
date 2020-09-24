import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AlertService } from "./alert.service";
import { Observable, of } from 'rxjs';
import { Station } from './station';


@Injectable({
  providedIn: 'root'
})
export class StationService {

  constructor(
    private http: HttpClient,
    private alertService: AlertService) { }

    private log(message: string) {
      this.alertService.add(`Station: ${message}`);
    }

    private stationsUrl = 'api/stations';  // URL to web api

    getStations(): Observable<Station[]> {
      return this.http.get<Station[]>(this.stationsUrl)
    }

}
