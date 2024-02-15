import {BasicEntity} from '@shared/models';

export interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  nationality: BasicEntity;
  wins: number;
  teams: BasicEntity[];
  currentTeam?: BasicEntity;

  currentTeamName?: string;
}
