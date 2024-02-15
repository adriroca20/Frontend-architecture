import {BasicEntity} from '@shared/models';

export interface Team {
  id: number;
  name: string;
  championships: number;
  drivers: BasicEntity[];
}