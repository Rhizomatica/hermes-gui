import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Station } from './station';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const stations = [
      { id: 11, name: 'una',   location: 'altamira' },
      { id: 12, name: 'barca', location: 'alter do chao' },
      { id: 13, name: 'mobata', location: 'altamira' },
      { id: 14, name: 'bacuri', location: 'altamira' },
      { id: 15, name: 'xantana', location: 'alter do chao' },
      { id: 16, name: 'niobia', location: 'altamira' },
      { id: 17, name: 'barra morta', location: 'altamira' },
      { id: 18, name: 'nativa', location: 'alter do chao' },
      { id: 19, name: 'maraca', location: 'xingú' },
      { id: 20, name: 'Tornado', location: 'belo monte' }
    ];
    return {stations};
  }

  // Overrides the genId method to ensure that a hero always has an id.
  // If the heroes array is empty,
  // the method below returns the initial number (11).
  // if the heroes array is not empty, the method below returns the highest
  // hero id + 1.
  genId(stations: Station[]): number {
    return stations.length > 0 ? Math.max(...stations.map(hero => hero.id)) + 1 : 11;
  }
}