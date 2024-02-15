import {Injectable} from '@angular/core';
import {BasicEntity} from '@shared/models';
import {BehaviorSubject, Observable} from 'rxjs';

import {Team} from '../00 model';

@Injectable({
  providedIn: 'root',
})
export class TeamState {
  private _team$ = new BehaviorSubject<Team[]>([]);
  private _updating$ = new BehaviorSubject<boolean>(false);

  public isUpdating$(): Observable<boolean> {
    return this._updating$.asObservable();
  }

  public setUpdating(isUpdating: boolean): void {
    this._updating$.next(isUpdating);
  }

  public getTeams$(): Observable<Team[]> {
    return this._team$.asObservable();
  }

  public addTeam(team: Team): void {
    const currentValue = this._team$.getValue();
    this._team$.next([...currentValue, team]);
  }

  public updateTeam(updatedTeam: Team): void {
    const currentValue: Team[] = this._team$.getValue();
    const indexOfTask = currentValue.findIndex((team) => team.id === updatedTeam.id);
    currentValue[indexOfTask] = updatedTeam;
    this._team$.next([...currentValue]);
  }

  public deleteTeam(teamToRemove: Team): void {
    const currentValue = this._team$.getValue();
    this._team$.next(currentValue.filter((team) => team.id !== teamToRemove.id));
  }

  public setTeams(team: Team[]): void {
    this._team$.next(team);
  }

  public getTeamsLatestValue(): Team[] {
    return JSON.parse(JSON.stringify(this._team$.getValue()));
  }

  public getTeamsAsBasicEntities(): BasicEntity[] {
    return this._team$.getValue().map((team) => ({
                                        id: team.id,
                                        name: team.name,
                                      }));
  }
}