import {Driver} from './driver.interface';

// export interface CreateDriverInput extends Omit<Driver, 'id' | 'teams' | 'currentTeam'> {
//   teams: number[];
//   currentTeam?: number;
// }

// export interface UpdateDriverInput extends Omit<Driver, 'teams' | 'currentTeam'> {
//   teams: number[];
//   currentTeam?: number;
// }

export interface CreateDriverInput extends Omit<Driver, 'id'|'currentTeamName'> {}

export interface UpdateDriverInput extends Omit<Driver, 'currentTeamName'> {}
