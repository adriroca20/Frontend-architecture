import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn} from '@angular/router';
import {BasicEntity} from '@shared/models';
import {finalize, forkJoin, Observable, of} from 'rxjs';

import {CountryFacade} from '../../country';
import {TeamFacade} from '../../team';
import {Driver} from '../00 model';
import {DriverFacade} from '../20 abstraction';

export const DriverResolverFn: ResolveFn<DriverScreenData> = (route: ActivatedRouteSnapshot) => {
  const _driverFacade: DriverFacade = inject(DriverFacade);
  const _countryFacade: CountryFacade = inject(CountryFacade);
  const _teamsFacade: TeamFacade = inject(TeamFacade);

  let showOverlaySpinner = false;

  const currentDriverScreenData: DriverScreenData = _getCurrentState();

  const request: DriverScreenDataRequest = _createRequest(currentDriverScreenData);

  return forkJoin({...request})
      .pipe(
          finalize(() => showOverlaySpinner = false),
      );

  function _getCurrentState(): DriverScreenData {
    const drivers: Driver[] = _driverFacade.getDriversLatestValue();
    const nationalities: BasicEntity[] = _countryFacade.getCountriesList();
    const teams: BasicEntity[] = _teamsFacade.getTeamsAsBasicEntities();

    return {
      drivers,
      nationalities,
      teams,
    };
  }

  function _createRequest(currentState: DriverScreenData): DriverScreenDataRequest {
    const driversAreLoaded = !!currentState.drivers.length;
    const countriesAreLoaded = !!currentState.nationalities.length;
    const teamsAreLoaded = !!currentState.teams.length;

    const storageIsLoaded = driversAreLoaded && countriesAreLoaded && teamsAreLoaded;

    if (!storageIsLoaded) {
      showOverlaySpinner = true;
      console.warn({showOverlaySpinner});
    }

    return {
      drivers: driversAreLoaded ? of(currentState.drivers) : _driverFacade.loadDriverOutput$(),
      nationalities: countriesAreLoaded ? of(currentState.nationalities) : _countryFacade.loadCountries$(),
      teams: teamsAreLoaded ? of(currentState.teams) : _teamsFacade.loadTeamOutput$(),
    };
  }
};

interface DriverScreenDataRequest {
  drivers: Observable<Driver[]>;
  nationalities: Observable<BasicEntity[]>;
  teams: Observable<BasicEntity[]>;
}

interface DriverScreenData {
  drivers: Driver[];
  nationalities: BasicEntity[];
  teams: BasicEntity[];
}
