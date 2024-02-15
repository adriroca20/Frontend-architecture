import {Team} from './team.interface';

export interface CreateTeamInput extends Omit<Team, 'id'|'drivers'> {
  drivers: number[];
}

export interface UpdateTeamInput extends Omit<Team, 'drivers'> {
  drivers: number[];
}
