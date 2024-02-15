import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve} from '@angular/router';
import {BasicEntity} from '@shared/models';
import {finalize, forkJoin, Observable, of} from 'rxjs';

import {Country, CountryFacade} from '../../country';
import {Driver} from '../00 model';
import {DriverFacade} from '../20 abstraction';

@Injectable({providedIn: 'root'})
export class DriverResolver implements Resolve<Observable<DriverScreenData>> {
  private _showOverlaySpinner = false;

  public constructor(
      private readonly _driverFacade: DriverFacade,
      private readonly _countryFacade: CountryFacade,
  ) {}

  public resolve(route: ActivatedRouteSnapshot): Observable<DriverScreenData> {
    const currentDriverScreenData: DriverScreenData = this._getCurrentState();
    const request: DriverScreenDataRequest = this._createRequest(currentDriverScreenData);

    return forkJoin({...request})
        .pipe(
            finalize(() => this._showOverlaySpinner = false),
        );
  }

  private _getCurrentState(): DriverScreenData {
    const drivers: Driver[] = this._driverFacade.getDriversLatestValue();
    const nationalities: Country[] = this._countryFacade.getCountriesList();

    return {
      drivers,
      nationalities,
    };
  }

  private _createRequest(currentState: DriverScreenData): DriverScreenDataRequest {
    const driversAreLoaded = !!currentState.drivers.length;
    const countriesAreLoaded = !!currentState.nationalities.length;

    const storageIsLoaded = driversAreLoaded && countriesAreLoaded;

    if (!storageIsLoaded) {
      this._showOverlaySpinner = true;
      console.warn({showOverlaySpinner: this._showOverlaySpinner});
    }

    return {
      drivers: driversAreLoaded ? of(currentState.drivers) : this._driverFacade.loadDriverOutput$(),
      nationalities: countriesAreLoaded ? of(currentState.nationalities) : this._countryFacade.loadCountries$(),
    };
  }
}

interface DriverScreenDataRequest {
  drivers: Observable<Driver[]>;
  nationalities: Observable<BasicEntity[]>;
}

interface DriverScreenData {
  drivers: Driver[];
  nationalities: BasicEntity[];
}
