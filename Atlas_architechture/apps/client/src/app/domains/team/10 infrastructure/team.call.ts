import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@environment';
import {GenericCreate, GenericUpdate} from '@shared/models';
import {Observable} from 'rxjs';

import {Team} from '../00 model';
import {CreateTeamInput, UpdateTeamInput} from '../00 model/';

const ENDPOINT_NAME = 'teams/';

@Injectable({
  providedIn: 'root',
})
export class TeamCall {
  private readonly _baseUrl: string = environment.apiUrl + ENDPOINT_NAME;

  public constructor(
      private readonly _http: HttpClient,
  ) {}

  public getTeamsOutput(): Observable<Team[]> {
    return this._http.get<Team[]>(this._baseUrl);
  }

  public addTeam(createTeamInput: CreateTeamInput): Observable<GenericCreate> {
    return this._http.post<GenericCreate>(`${this._baseUrl}`, createTeamInput);
  }

  public updateTeam(updateTeamInput: UpdateTeamInput): Observable<GenericUpdate> {
    return this._http.put<GenericUpdate>(`${this._baseUrl}${updateTeamInput.id}`, updateTeamInput);
  }

  public deleteTeam(team: Team): Observable<GenericUpdate> {
    return this._http.delete(`${this._baseUrl}${team.id}`);
  }
}
