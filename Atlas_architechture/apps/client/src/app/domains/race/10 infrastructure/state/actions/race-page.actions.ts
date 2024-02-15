
/* NgRx */
import {createAction, props} from '@ngrx/store';

import {Race} from '../../../00 model';

const ACTION = '[Race Page]';
export const toggleRaceCode = createAction(`${ACTION} Toggle Race Code`);

export const setCurrentRace = createAction(`${ACTION} Set Current Race`, props<{currentRaceId: number}>());

export const clearCurrentRace = createAction(`${ACTION} Clear Current Race`);

export const initializeCurrentRace = createAction(`${ACTION} Initialize Current Race`);

export const loadRaces = createAction(`${ACTION} Load`);

export const updateRace = createAction(`${ACTION} Update Race`, props<{race: Race}>());

export const createRace = createAction(`${ACTION} Create Race`, props<{race: Race}>());

export const deleteRace = createAction(`${ACTION} Delete Race`, props<{raceId: number}>());
