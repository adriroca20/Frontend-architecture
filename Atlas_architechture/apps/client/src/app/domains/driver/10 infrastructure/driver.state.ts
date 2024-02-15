import {Injectable} from '@angular/core';
import {BasicEntity} from '@shared/models';
import {BehaviorSubject, map, Observable} from 'rxjs';

import {Driver} from '../00 model';

@Injectable({
  providedIn: 'root',
})
export class DriverState {
  private _driver$ = new BehaviorSubject<Driver[]>([]);
  private _updating$ = new BehaviorSubject<boolean>(false);

  private _histoicChanges: Driver[][] = [];

  public isUpdating$(): Observable<boolean> {
    return this._updating$.asObservable();
  }

  public setUpdating(isUpdating: boolean): void {
    this._updating$.next(isUpdating);
  }

  public getDrivers$(): Observable<Driver[]> {
    return this._driver$.asObservable().pipe(
        map((drivers) => drivers.sort((a, b) => a.lastName.localeCompare(b.lastName))),
        map((drivers) => drivers.map((a) => ({...a, currentTeamName: a.currentTeam?.name}))),
    );
  }

  public addDriver(driver: Driver): void {
    const currentValue = this._driver$.getValue();
    this._driver$.next([...currentValue, driver]);
  }

  public updateDriver(updatedDriver: Driver): void {
    const currentValue: Driver[] = this._driver$.getValue();
    const indexOfTask = currentValue.findIndex((driver) => driver.id === updatedDriver.id);
    currentValue[indexOfTask] = updatedDriver;
    this._driver$.next([...currentValue]);
  }

  public deleteDriver(driverToRemove: Driver): void {
    const currentValue = this._driver$.getValue();
    this._driver$.next(currentValue.filter((driver) => driver.id !== driverToRemove.id));
  }

  public setDrivers(driver: Driver[]): void {
    this._driver$.next(driver);
  }

  public getDriversLatestValue(): Driver[] {
    return JSON.parse(JSON.stringify(this._driver$.getValue()));
  }

  public getDriversAsBasicEntities(): BasicEntity[] {
    return this._driver$.getValue().map((driver) => {
      return {
        id: driver.id,
        name: driver.firstName + ' ' + driver.lastName,
      };
    });
  }
}