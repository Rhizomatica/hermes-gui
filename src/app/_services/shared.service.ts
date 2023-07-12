import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class SharedService {
  public radioObj = new BehaviorSubject<any>({
    frequency: 7010000
  });
}