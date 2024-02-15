import {Injectable} from '@angular/core';
import {BasicEntity, GenericCreate} from '@shared/models';
import {delay, finalize, Observable, tap} from 'rxjs';

import {CreateDriverInput, Driver, UpdateDriverInput} from '../00 model';
import {DriverCall, DriverState} from '../10 infrastructure';

@Injectable({
  providedIn: 'root',
})
export class DriverFacade {
  public constructor(
      private readonly _driverCall: DriverCall,
      private readonly _driverState: DriverState,
  ) {}

  public isUpdating$(): Observable<boolean> {
    return this._driverState.isUpdating$();
  }

  public getDrivers$(): Observable<Driver[]> {
    return this._driverState.getDrivers$();
  }

  public loadDriverOutput$(): Observable<Driver[]> {
    return this._driverCall.getDriversOutput().pipe(
        tap((drivers: Driver[]) => this._driverState.setDrivers(drivers)),
    );
  }

  public addDriver(driverToCreate: Driver): void {
    this._driverState.setUpdating(true);

    const {age, firstName, lastName, nationality, teams, wins, currentTeam} = driverToCreate;
    const createDriverInput: CreateDriverInput = {
      age,
      firstName,
      lastName,
      nationality,
      teams,
      wins,
      currentTeam,
    };

    this._driverCall.addDriver(createDriverInput)
        .pipe(
            delay(4000),
            tap((response: GenericCreate) => {
              debugger;
              const driverToAdd: Driver = JSON.parse(JSON.stringify({...driverToCreate, id: response.id}));
              this._driverState.addDriver(driverToAdd);
            }),
            finalize(() => this._driverState.setUpdating(false)),
            )
        .subscribe();
  }

  public updateDriver(driverToUpdate: Driver): void {
    console.log({redWasHere: driverToUpdate});
    const updateDriverInput: UpdateDriverInput = {
      ...driverToUpdate,
      // teams: driverToUpdate.teams.map((team) => team.id),
      // currentTeam: driverToUpdate.currentTeam?.id,
    };

    this._driverState.setUpdating(true);

    this._driverCall.updateDriver(updateDriverInput)
        .pipe(
            delay(4000),
            tap(() => this._driverState.updateDriver(driverToUpdate)),
            finalize(() => this._driverState.setUpdating(false)),
            )
        .subscribe();
  }

  public deleteDriver(driverToDelete: Driver): void {
    this._driverState.setUpdating(true);
    this._driverCall.deleteDriver(driverToDelete)
        .pipe(
            delay(4000),
            tap(() => this._driverState.deleteDriver(driverToDelete)),
            finalize(() => this._driverState.setUpdating(false)),
            )
        .subscribe();
  }

  public getDriversLatestValue(): Driver[] {
    return this._driverState.getDriversLatestValue();
  }

  public getDriversAsBasicEntities(): BasicEntity[] {
    return this._driverState.getDriversAsBasicEntities();
  }
}
