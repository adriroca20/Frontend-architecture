import {Injectable} from '@angular/core';
import {BasicEntity, GenericCreate} from '@shared/models';
import {finalize, Observable, tap} from 'rxjs';

import {CreateTeamInput, Team, UpdateTeamInput} from '../00 model';
import {TeamCall, TeamState} from '../10 infrastructure';

@Injectable({
  providedIn: 'root',
})
export class TeamFacade {
  public constructor(
      private readonly _teamCall: TeamCall,
      private readonly _teamState: TeamState,
  ) {}

  public isUpdating$(): Observable<boolean> {
    return this._teamState.isUpdating$();
  }

  public getTeams$(): Observable<Team[]> {
    return this._teamState.getTeams$();
  }

  public loadTeamOutput$(): Observable<Team[]> {
    return this._teamCall.getTeamsOutput().pipe(
        tap((teams: Team[]) => this._teamState.setTeams(teams)),
    );
  }

  public addTeam(teamToCreate: Team): void {
    this._teamState.setUpdating(true);

    const createTeamInput: CreateTeamInput = {
      ...teamToCreate,
      drivers: teamToCreate.drivers.map((driver) => driver.id),
    };

    this._teamCall.addTeam(createTeamInput)
        .pipe(
            tap((response: GenericCreate) => {
              const teamToAdd: Team = JSON.parse(JSON.stringify({...teamToCreate, id: response.id}));
              this._teamState.addTeam(teamToAdd);
            }),
            finalize(() => this._teamState.setUpdating(false)),
            )
        .subscribe();
  }

  public updateTeam(teamToUpdate: Team): void {
    const updateTeamInput: UpdateTeamInput = {
      ...teamToUpdate,
      drivers: teamToUpdate.drivers.map((driver) => driver.id),
    };

    this._teamState.setUpdating(true);

    this._teamCall.updateTeam(updateTeamInput)
        .pipe(
            tap(() => this._teamState.updateTeam(teamToUpdate)),
            finalize(() => this._teamState.setUpdating(false)),
            )
        .subscribe();
  }

  public deleteTeam(teamToDelete: Team): void {
    this._teamState.setUpdating(true);
    this._teamCall.deleteTeam(teamToDelete)
        .pipe(
            tap(() => this._teamState.deleteTeam(teamToDelete)),
            finalize(() => this._teamState.setUpdating(false)),
            )
        .subscribe();
  }

  public getTeamsLatestValue(): Team[] {
    return this._teamState.getTeamsLatestValue();
  }

  public getTeamsAsBasicEntities(): BasicEntity[] {
    return this._teamState.getTeamsAsBasicEntities();
  }
}
