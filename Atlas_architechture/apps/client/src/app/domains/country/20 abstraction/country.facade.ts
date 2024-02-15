import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

import {Country} from '../00 model';
import {CountryCall, CountryStorage} from '../10 infrastructure';

@Injectable({
  providedIn: 'root',
})
export class CountryFacade {
  public constructor(
      private readonly _countryStorage: CountryStorage,
      private readonly _countryCall: CountryCall,
  ) {}

  public loadCountries$(): Observable<Country[]> {
    return this._countryCall.getCountriesList$().pipe(
        tap((countrys: Country[]) => this._countryStorage.setCountriesList(countrys)),
    );
  }

  public getCountriesList(): Country[] {
    return this._countryStorage.getCountriesList();
  }
}
