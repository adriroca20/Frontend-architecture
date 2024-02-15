import {Injectable} from '@angular/core';

import {Country} from '../00 model';

@Injectable({
  providedIn: 'root',
})
export class CountryStorage {
  private _stationsList: Country[] = [];

  public setCountriesList(stations: Country[]): void {
    this._stationsList = stations;
  }

  public getCountriesList(): Country[] {
    return JSON.parse(JSON.stringify(this._stationsList));
  }
}
